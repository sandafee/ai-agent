const { ethers } = require('ethers');

class BlockchainService {
  constructor() {
    this.rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
    this.contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    this.provider = null;
  }

  getProvider() {
    if (!this.provider) {
      try {
        this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      } catch (e) {
        console.warn("Blockchain Provider fallback initialization:", e.message);
      }
    }
    return this.provider;
  }

  /**
   * Mock / live anchor agent DID and mandate hash to KYARegistry on EVM smart contract.
   */
  async anchorAgentMandateOnChain(agentDid, mandateId, spendingLimitPerTx, dailyCap) {
    try {
      // Return synthetic block transaction verification proof
      const txHash = "0x" + require('crypto').createHash('sha256').update(`${agentDid}:${mandateId}:${Date.now()}`).digest('hex');
      return {
        success: true,
        txHash: txHash,
        blockNumber: 1984201,
        contractAddress: this.contractAddress,
        status: "CONFIRMED_ON_CHAIN"
      };
    } catch (error) {
      console.error("Blockchain anchoring error:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BlockchainService();
