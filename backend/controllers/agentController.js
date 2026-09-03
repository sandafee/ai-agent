const AgentModel = require('../models/Agent');
const DIDService = require('../services/didService');
const AuditLogModel = require('../models/AuditLog');

exports.getAllAgents = (req, res, next) => {
  try {
    const agents = AgentModel.findAll();
    res.json({ success: true, count: agents.length, data: agents });
  } catch (err) {
    next(err);
  }
};

exports.getAgentByDid = (req, res, next) => {
  try {
    const { did } = req.params;
    const agent = AgentModel.findByDid(did) || AgentModel.findById(did);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }
    const didDoc = DIDService.resolveDID(agent.did, agent);
    res.json({ success: true, data: agent, didDocument: didDoc });
  } catch (err) {
    next(err);
  }
};

exports.createAgent = (req, res, next) => {
  try {
    const { name, description, ownerAddress, riskScore } = req.body;
    if (!name || !ownerAddress) {
      return res.status(400).json({ success: false, message: 'Agent name and owner address are required' });
    }

    const { did, publicKey } = DIDService.generateAgentDID(name, ownerAddress);
    const newAgent = {
      id: `agent_${Date.now()}`,
      did,
      name,
      description: description || 'Autonomous AI Financial Agent',
      owner_address: ownerAddress,
      public_key: publicKey,
      status: 'ACTIVE',
      risk_score: parseInt(riskScore) || 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    AgentModel.create(newAgent);
    AuditLogModel.log('AGENT', did, 'CREATED', ownerAddress, `Registered new Agent DID: ${did}`);

    res.status(201).json({ success: true, message: 'Agent registered successfully', data: newAgent });
  } catch (err) {
    next(err);
  }
};

exports.updateAgentStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['ACTIVE', 'SUSPENDED', 'REVOKED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = AgentModel.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    AuditLogModel.log('AGENT', id, 'STATUS_CHANGE', 'Admin', `Updated Agent status to ${status}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
