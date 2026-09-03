const db = require('../models/db');

exports.getOverview = (req, res, next) => {
  try {
    const agents = db.getCollection('agents');
    const mandates = db.getCollection('mandates');
    const transactions = db.getCollection('transactions');
    const securityLogs = db.getCollection('security_logs');

    const totalVolume = transactions
      .filter(t => t.status === 'APPROVED')
      .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const blockedCount = transactions.filter(t => t.status !== 'APPROVED').length;

    res.json({
      success: true,
      data: {
        activeAgents: agents.filter(a => a.status === 'ACTIVE').length,
        totalAgents: agents.length,
        activeMandates: mandates.filter(m => m.status === 'ACTIVE').length,
        totalVolumeUSD: totalVolume,
        totalTransactions: transactions.length,
        blockedTransactions: blockedCount,
        securityThreatsIntercepted: securityLogs.length,
        avgRiskScore: Math.round(agents.reduce((acc, a) => acc + (a.risk_score || 0), 0) / (agents.length || 1))
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getRevenueStats = (req, res, next) => {
  try {
    const rev = db.getCollection('revenue_stats');
    const transactions = db.getCollection('transactions').filter(t => t.status === 'APPROVED');
    
    const totalEarnings = rev.reduce((acc, r) => acc + parseFloat(r.transaction_fees_earned || 0), 0);
    const totalVolume = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    res.json({
      success: true,
      data: {
        totalEarnings,
        totalVolumeProcessed: totalVolume,
        feeRatePercent: 1.0, // 1% platform KYA security fee
        history: rev
      }
    });
  } catch (err) {
    next(err);
  }
};
