const CredentialService = require('../services/credentialService');
const db = require('../models/db');
const AuditLogModel = require('../models/AuditLog');

exports.issueCredential = (req, res, next) => {
  try {
    const { issuerDid, agentDid, maxSingleTx, dailyCap, merchantCategories } = req.body;
    if (!agentDid || !maxSingleTx || !dailyCap) {
      return res.status(400).json({ success: false, message: 'agentDid, maxSingleTx, and dailyCap are required' });
    }

    const vc = CredentialService.issueMandateCredential(
      issuerDid,
      agentDid,
      maxSingleTx,
      dailyCap,
      merchantCategories
    );

    db.insert('credentials', vc);
    AuditLogModel.log('CREDENTIAL', vc.id, 'ISSUED', issuerDid || 'Central Authority', `Issued VC to ${agentDid}`);

    res.status(201).json({ success: true, data: vc });
  } catch (err) {
    next(err);
  }
};

exports.verifyCredential = (req, res, next) => {
  try {
    const { vcPayload, proofSignature } = req.body;
    const result = CredentialService.verifyCredential(vcPayload, proofSignature);
    res.json({ success: true, verification: result });
  } catch (err) {
    next(err);
  }
};
