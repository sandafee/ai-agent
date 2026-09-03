const DIDService = require('../services/didService');
const AgentModel = require('../models/Agent');

exports.resolveDid = (req, res, next) => {
  try {
    const { did } = req.params;
    const agent = AgentModel.findByDid(did);
    const didDoc = DIDService.resolveDID(did, agent);

    if (!didDoc) {
      return res.status(404).json({ success: false, message: 'DID could not be resolved' });
    }

    res.json({ success: true, didDocument: didDoc });
  } catch (err) {
    next(err);
  }
};

exports.registerDid = (req, res, next) => {
  try {
    const { name, ownerAddress } = req.body;
    if (!name || !ownerAddress) {
      return res.status(400).json({ success: false, message: 'name and ownerAddress are required' });
    }

    const didInfo = DIDService.generateAgentDID(name, ownerAddress);
    res.json({ success: true, data: didInfo });
  } catch (err) {
    next(err);
  }
};
