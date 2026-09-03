const MandateModel = require('../models/Mandate');
const AgentModel = require('../models/Agent');
const CredentialService = require('../services/credentialService');
const BlockchainService = require('../services/blockchainService');
const AuditLogModel = require('../models/AuditLog');

exports.getAllMandates = (req, res, next) => {
  try {
    const mandates = MandateModel.findAll();
    res.json({ success: true, count: mandates.length, data: mandates });
  } catch (err) {
    next(err);
  }
};

exports.getMandateByAgentDid = (req, res, next) => {
  try {
    const { agentDid } = req.params;
    const mandate = MandateModel.findByAgentDid(agentDid);
    if (!mandate) {
      return res.status(404).json({ success: false, message: 'Mandate not found for specified Agent' });
    }
    res.json({ success: true, data: mandate });
  } catch (err) {
    next(err);
  }
};

exports.createMandate = async (req, res, next) => {
  try {
    const { agentDid, maxSingleTx, dailyCap, merchantCategories, durationDays } = req.body;
    if (!agentDid || !maxSingleTx || !dailyCap) {
      return res.status(400).json({ success: false, message: 'agentDid, maxSingleTx, and dailyCap are required' });
    }

    const agent = AgentModel.findByDid(agentDid);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent DID not found in registry' });
    }

    // Issue VC credential object
    const vcCredential = CredentialService.issueMandateCredential(
      "did:kya:authority:central-bank-mainnet",
      agentDid,
      maxSingleTx,
      dailyCap,
      merchantCategories || "fintech,escrow,settlement",
      durationDays || 180
    );

    const mandateRecord = {
      id: vcCredential.id,
      agent_did: agentDid,
      vc_jwt: vcCredential.proof_signature,
      spending_limit_per_tx: parseFloat(maxSingleTx),
      daily_spending_cap: parseFloat(dailyCap),
      current_daily_spent: 0.00,
      merchant_categories: Array.isArray(merchantCategories) ? merchantCategories.join(',') : (merchantCategories || "fintech,escrow,settlement"),
      status: "ACTIVE",
      expires_at: vcCredential.expires_at,
      created_at: new Date().toISOString()
    };

    MandateModel.create(mandateRecord);

    // Anchor mandate on blockchain
    await BlockchainService.anchorAgentMandateOnChain(agentDid, mandateRecord.id, maxSingleTx, dailyCap);

    AuditLogModel.log('MANDATE', mandateRecord.id, 'CREATED', agent.owner_address, `Issued Verifiable Mandate with max single cap $${maxSingleTx}`);

    res.status(201).json({
      success: true,
      message: 'Mandate issued & anchored on-chain successfully',
      data: mandateRecord,
      verifiableCredential: JSON.parse(vcCredential.vc_payload)
    });
  } catch (err) {
    next(err);
  }
};

exports.revokeMandate = (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Mandate ID is required' });
    }

    const updated = MandateModel.updateStatus(id, 'REVOKED');
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Mandate not found' });
    }

    AuditLogModel.log('MANDATE', id, 'REVOKED', 'Admin', 'Revoked Verifiable Mandate Credential');
    res.json({ success: true, message: 'Mandate revoked successfully', data: updated });
  } catch (err) {
    next(err);
  }
};
