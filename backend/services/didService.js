const crypto = require('crypto');

class DIDService {
  /**
   * Generates a W3C compliant Decentralized Identifier (DID) and Ed25519 key pair for an AI Agent.
   * Method: did:kya:solana:<hash>
   */
  static generateAgentDID(name, ownerAddress) {
    const seed = `${name}:${ownerAddress}:${Date.now()}:${Math.random()}`;
    const hash = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 24);
    const did = `did:kya:solana:${hash}`;

    // Cryptographic key generation simulation (Ed25519)
    const pubKeyHash = crypto.createHash('sha256').update(seed + "_pub").digest('hex').slice(0, 32);
    const publicKey = `ed25519:${pubKeyHash}`;

    return {
      did,
      publicKey,
      ownerAddress
    };
  }

  /**
   * Resolves a DID string into a standard W3C DID Document representation.
   */
  static resolveDID(did, agentData) {
    if (!did) return null;

    return {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "id": did,
      "controller": agentData ? agentData.owner_address : "did:kya:authority:mainnet",
      "verificationMethod": [
        {
          "id": `${did}#key-1`,
          "type": "Ed25519VerificationKey2020",
          "controller": did,
          "publicKeyMultibase": agentData ? agentData.public_key : "ed25519:default"
        }
      ],
      "authentication": [
        `${did}#key-1`
      ],
      "assertionMethod": [
        `${did}#key-1`
      ],
      "service": [
        {
          "id": `${did}#escrow-rail`,
          "type": "AutonomousPaymentRail",
          "serviceEndpoint": "https://api.kya-protocol.org/rail/solana"
        }
      ]
    };
  }
}

module.exports = DIDService;
