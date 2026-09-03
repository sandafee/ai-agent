const SecurityService = require('../services/securityService');
const db = require('../models/db');
const AuditLogModel = require('../models/AuditLog');

exports.scanPrompt = (req, res, next) => {
  try {
    const { prompt, agentDid } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'prompt text is required' });
    }

    const result = SecurityService.scanPromptPayload(prompt);

    if (!result.safe) {
      const secLog = {
        id: `sec_${Date.now()}`,
        agent_did: agentDid || 'did:kya:solana:general_sandbox',
        threat_type: result.flags[0]?.type || 'PROMPT_INJECTION',
        prompt_payload: prompt,
        action_taken: result.actionTaken,
        severity: result.severity,
        risk_score: result.threatScore,
        timestamp: new Date().toISOString()
      };
      db.insert('security_logs', secLog);
      AuditLogModel.log('SECURITY', secLog.id, 'THREAT_INTERCEPTED', secLog.agent_did, `Interception score ${result.threatScore}/100`);
    }

    res.json({ success: true, scanResult: result });
  } catch (err) {
    next(err);
  }
};

exports.getSecurityLogs = (req, res, next) => {
  try {
    const logs = db.getCollection('security_logs');
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};
