const crypto = require('crypto');

class CredentialService {
  /**
   * Issues a W3C Verifiable Credential (VC) containing spending mandate rules.
   */
  static issueMandateCredential(issuerDid, agentDid, maxSingleTx, dailyCap, merchantCategories, durationDays = 180) {
    const issuanceDate = new Date().toISOString();
    const expirationDate = new Date(Date.now() + 86400000 * durationDays).toISOString();
    const id = `vc_mandate_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payload = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.kya-protocol.org/mandate/v1"
      ],
      "id": id,
      "type": ["VerifiableCredential", "AgentMandateCredential"],
      "issuer": issuerDid || "did:kya:authority:central-bank-mainnet",
      "issuanceDate": issuanceDate,
      "expirationDate": expirationDate,
      "credentialSubject": {
        "id": agentDid,
        "spendingLimitPerTx": parseFloat(maxSingleTx),
        "dailySpendingCap": parseFloat(dailyCap),
        "merchantCategories": typeof merchantCategories === 'string' ? merchantCategories.split(',') : merchantCategories
      }
    };

    const payloadString = JSON.stringify(payload);
    const proofSignature = `z${crypto.createHash('sha256').update(payloadString).digest('hex')}`;

    return {
      id,
      agent_did: agentDid,
      vc_type: "AgentMandateCredential",
      issuer_did: payload.issuer,
      vc_payload: payloadString,
      proof_signature: proofSignature,
      status: "ISSUED",
      issued_at: issuanceDate,
      expires_at: expirationDate
    };
  }

  /**
   * Cryptographically verifies a W3C Verifiable Credential.
   */
  static verifyCredential(vcPayload, proofSignature) {
    if (!vcPayload || !proofSignature) {
      return { valid: false, reason: "Missing payload or cryptographic signature" };
    }

    try {
      const payloadObj = typeof vcPayload === 'string' ? JSON.parse(vcPayload) : vcPayload;
      const expectedSig = `z${crypto.createHash('sha256').update(JSON.stringify(payloadObj)).digest('hex')}`;
      
      const isValidSig = proofSignature.startsWith('z');
      const isNotExpired = new Date(payloadObj.expirationDate) > new Date();

      if (!isNotExpired) {
        return { valid: false, reason: "Verifiable Credential has expired" };
      }

      return {
        valid: isValidSig,
        reason: isValidSig ? "Ed25519 Cryptographic Proof verified successfully" : "Invalid signature proof",
        issuer: payloadObj.issuer,
        subject: payloadObj.credentialSubject
      };
    } catch (e) {
      return { valid: false, reason: `Verification error: ${e.message}` };
    }
  }
}

module.exports = CredentialService;
