const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KYARegistry Smart Contract", function () {
  let kyaRegistry;
  let admin;
  let owner1;
  let owner2;

  const sampleDid = "did:kya:solana:8x9a7b6c5d4e3f2a1";
  const samplePubKey = "ed25519:7k8m9p0q1r2s3t4u5v6w7x8y9z0a1b2c";
  const mandateId = ethers.keccak256(ethers.toUtf8Bytes("mandate_001"));
  const vcHash = ethers.keccak256(ethers.toUtf8Bytes("vc_payload_hash"));

  beforeEach(async function () {
    [admin, owner1, owner2] = await ethers.getSigners();

    const KYARegistryFactory = await ethers.getContractFactory("KYARegistry");
    kyaRegistry = await KYARegistryFactory.deploy();
    await kyaRegistry.waitForDeployment();
  });

  describe("Agent Registration", function () {
    it("Should register a new agent successfully", async function () {
      await kyaRegistry.connect(owner1).registerAgent(sampleDid, samplePubKey, 15);

      const agent = await kyaRegistry.agents(sampleDid);
      expect(agent.did).to.equal(sampleDid);
      expect(agent.owner).to.equal(owner1.address);
      expect(agent.publicKey).to.equal(samplePubKey);
      expect(agent.riskScore).to.equal(15);
      expect(agent.status).to.equal(0); // AgentStatus.Active
    });

    it("Should prevent duplicate agent registrations", async function () {
      await kyaRegistry.connect(owner1).registerAgent(sampleDid, samplePubKey, 15);
      await expect(
        kyaRegistry.connect(owner1).registerAgent(sampleDid, samplePubKey, 20)
      ).to.be.revertedWith("KYARegistry: Agent already registered");
    });
  });

  describe("Mandate Lifecycle & Verification", function () {
    beforeEach(async function () {
      await kyaRegistry.connect(owner1).registerAgent(sampleDid, samplePubKey, 10);
    });

    it("Should issue a mandate for an active agent", async function () {
      const spendingLimitPerTx = 5000;
      const dailyCap = 25000;
      const duration = 86400; // 24h

      await kyaRegistry.connect(owner1).issueMandate(
        sampleDid,
        mandateId,
        vcHash,
        spendingLimitPerTx,
        dailyCap,
        duration
      );

      const mandate = await kyaRegistry.agentMandates(sampleDid);
      expect(mandate.active).to.be.true;
      expect(mandate.spendingLimitPerTx).to.equal(spendingLimitPerTx);
    });

    it("Should authorize a transaction within spending limit", async function () {
      await kyaRegistry.connect(owner1).issueMandate(
        sampleDid,
        mandateId,
        vcHash,
        5000,
        25000,
        86400
      );

      const [approved, reason] = await kyaRegistry.verifyTransaction.staticCall(sampleDid, 1000);
      expect(approved).to.be.true;
      expect(reason).to.equal("Transaction authorized by mandate");
    });

    it("Should reject transaction exceeding spending limit", async function () {
      await kyaRegistry.connect(owner1).issueMandate(
        sampleDid,
        mandateId,
        vcHash,
        1000,
        5000,
        86400
      );

      const [approved, reason] = await kyaRegistry.verifyTransaction.staticCall(sampleDid, 2500);
      expect(approved).to.be.false;
      expect(reason).to.equal("Exceeds single transaction limit");
    });
  });
});
