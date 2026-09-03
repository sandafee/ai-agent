const TransactionModel = require('../models/Transaction');
const AgentModel = require('../models/Agent');
const MandateModel = require('../models/Mandate');
const AuthorizationService = require('../services/authorizationService');
const SecurityService = require('../services/securityService');
const AuditLogModel = require('../models/AuditLog');
const crypto = require('crypto');

exports.getAllTransactions = (req, res, next) => {
  try {
    const transactions = TransactionModel.findAll();
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    next(err);
  }
};

exports.authorizeTransaction = (req, res, next) => {
  try {
    const { agentDid, amount, recipientAddress, merchantCategory, promptPayload } = req.body;
    if (!agentDid || !amount || !recipientAddress) {
      return res.status(400).json({ success: false, message: 'agentDid, amount, and recipientAddress are required' });
    }

    const agent = AgentModel.findByDid(agentDid);
    const mandate = MandateModel.findByAgentDid(agentDid);

    // Step 1: Real-Time Sherlock Prompt Injection & Threat Scanner
    let securityResult = { safe: true, threatScore: 0 };
    if (promptPayload) {
      securityResult = SecurityService.scanPromptPayload(promptPayload);
      if (!securityResult.safe) {
        const txId = `tx_${Date.now()}`;
        const txHash = `0x${crypto.createHash('sha256').update(txId + Date.now()).digest('hex')}`;
        const blockedTx = {
          id: txId,
          tx_hash: txHash,
          agent_did: agentDid,
          amount: parseFloat(amount),
          currency: 'USD',
          recipient_address: recipientAddress,
          merchant_category: merchantCategory || 'unknown',
          status: 'BLOCKED_PROMPT_INJECTION',
          risk_score: securityResult.threatScore,
          details: `Blocked by Sherlock AI: Prompt injection / adversarial threat detected (Score: ${securityResult.threatScore}/100)`,
          created_at: new Date().toISOString()
        };

        TransactionModel.create(blockedTx);
        AuditLogModel.log('TRANSACTION', txId, 'BLOCKED_SECURITY', agentDid, `Prompt injection attack intercepted by Sherlock Scanner`);

        return res.status(403).json({
          success: false,
          authorized: false,
          status: 'BLOCKED_PROMPT_INJECTION',
          reason: 'Transaction blocked due to adversarial prompt injection threat',
          securityScan: securityResult,
          transaction: blockedTx
        });
      }
    }

    // Step 2: Mandate & Spending Limit Compliance Evaluation
    const authEval = AuthorizationService.evaluateTransactionAuthorization(agent, mandate, amount, merchantCategory);

    const txId = `tx_${Date.now()}`;
    const txHash = `0x${crypto.createHash('sha256').update(txId + Date.now()).digest('hex')}`;

    const txRecord = {
      id: txId,
      tx_hash: txHash,
      agent_did: agentDid,
      amount: parseFloat(amount),
      currency: 'USD',
      recipient_address: recipientAddress,
      merchant_category: merchantCategory || 'escrow',
      status: authEval.status,
      risk_score: authEval.authorized ? 5 : 85,
      details: authEval.reason,
      created_at: new Date().toISOString()
    };

    TransactionModel.create(txRecord);

    if (authEval.authorized) {
      MandateModel.addSpent(agentDid, amount);
      AuditLogModel.log('TRANSACTION', txId, 'AUTHORIZED', agentDid, `Authorized $${amount} transfer to ${recipientAddress}`);
    } else {
      AuditLogModel.log('TRANSACTION', txId, 'BLOCKED_MANDATE', agentDid, `Transaction blocked: ${authEval.reason}`);
    }

    res.json({
      success: true,
      authorized: authEval.authorized,
      status: authEval.status,
      reason: authEval.reason,
      securityScan: securityResult,
      transaction: txRecord
    });
  } catch (err) {
    next(err);
  }
};
