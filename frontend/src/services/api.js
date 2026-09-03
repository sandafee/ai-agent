import axios from 'axios';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Fallback Mock Dataset if backend offline
const mockData = {
  overview: {
    activeAgents: 3,
    totalAgents: 3,
    activeMandates: 2,
    totalVolumeUSD: 425050.00,
    totalTransactions: 4,
    blockedTransactions: 2,
    securityThreatsIntercepted: 2,
    avgRiskScore: 14
  },
  agents: [
    {
      id: "agent_sol_001",
      did: "did:kya:solana:8x9a7b6c5d4e3f2a1",
      name: "Apex Finance Autonomous Escrow Agent",
      description: "Automated liquidity rebalancer and escrow execution bot operating on Solana & M-Pesa rails.",
      owner_address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      public_key: "ed25519:7k8m9p0q1r2s3t4u5v6w7x8y9z0a1b2c",
      status: "ACTIVE",
      risk_score: 12,
      created_at: new Date(Date.now() - 86400000 * 14).toISOString()
    },
    {
      id: "agent_mpesa_002",
      did: "did:kya:solana:3m4n5p6q7r8s9t0u1",
      name: "Safaricom Micro-Lending Underwriter",
      description: "Credit scoring & automated disbursement AI for small-medium enterprise loans.",
      owner_address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      public_key: "ed25519:9v8u7t6s5r4q3p2o1n0m9l8k7j6i5h4g",
      status: "ACTIVE",
      risk_score: 8,
      created_at: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    {
      id: "agent_trade_003",
      did: "did:kya:solana:9f8e7d6c5b4a3z2y1",
      name: "Global Arbitrage HFT Execution Agent",
      description: "High-frequency cross-dex arbitrage bot with dynamic slippage controls.",
      owner_address: "0xbDA57472D5EEE43D4925B831DA8180E5F8504538",
      public_key: "ed25519:1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      status: "SUSPENDED",
      risk_score: 68,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  mandates: [
    {
      id: "mandate_001",
      agent_did: "did:kya:solana:8x9a7b6c5d4e3f2a1",
      spending_limit_per_tx: 5000.00,
      daily_spending_cap: 25000.00,
      current_daily_spent: 8450.00,
      merchant_categories: "fintech,escrow,settlement,micro-lending",
      status: "ACTIVE",
      expires_at: new Date(Date.now() + 86400000 * 180).toISOString()
    },
    {
      id: "mandate_002",
      agent_did: "did:kya:solana:3m4n5p6q7r8s9t0u1",
      spending_limit_per_tx: 10000.00,
      daily_spending_cap: 50000.00,
      current_daily_spent: 18200.00,
      merchant_categories: "micro-lending,underwriting,banking",
      status: "ACTIVE",
      expires_at: new Date(Date.now() + 86400000 * 90).toISOString()
    }
  ],
  transactions: [
    {
      id: "tx_1001",
      tx_hash: "0x8f3c2a1b9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b",
      agent_did: "did:kya:solana:8x9a7b6c5d4e3f2a1",
      amount: 2500.00,
      currency: "USD",
      recipient_address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      merchant_category: "escrow",
      status: "APPROVED",
      risk_score: 4,
      details: "Automated liquidity vault deployment",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "tx_1002",
      tx_hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      agent_did: "did:kya:solana:8x9a7b6c5d4e3f2a1",
      amount: 12500.00,
      currency: "USD",
      recipient_address: "0x3C44CdD47050671358A6B72467b6894645474097",
      merchant_category: "unauthorized_gambling",
      status: "BLOCKED_MANDATE",
      risk_score: 92,
      details: "Transaction blocked: Exceeds single tx cap of $5,000.00",
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: "tx_1003",
      tx_hash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      agent_did: "did:kya:solana:3m4n5p6q7r8s9t0u1",
      amount: 4200.00,
      currency: "USD",
      recipient_address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      merchant_category: "micro-lending",
      status: "APPROVED",
      risk_score: 9,
      details: "Automated SME Working Capital Line Disbursement",
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      id: "tx_1004",
      tx_hash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
      agent_did: "did:kya:solana:9f8e7d6c5b4a3z2y1",
      amount: 50000.00,
      currency: "USD",
      recipient_address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      merchant_category: "unknown",
      status: "BLOCKED_PROMPT_INJECTION",
      risk_score: 98,
      details: "Blocked by Sherlock Defense Engine: System instruction override attack detected",
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ],
  auditLogs: [
    {
      id: "audit_001",
      entity_type: "AGENT",
      entity_id: "did:kya:solana:8x9a7b6c5d4e3f2a1",
      action: "CREATED",
      actor: "Central Bank Regulator (ID: REG-882)",
      details: "Issued W3C Decentralized Identifier did:kya:solana:8x9a7b6c5d4e3f2a1",
      hash: "a1b2c3d4e5f6...",
      timestamp: new Date(Date.now() - 86400000 * 14).toISOString()
    },
    {
      id: "audit_002",
      entity_type: "MANDATE",
      entity_id: "mandate_001",
      action: "CREATED",
      actor: "Apex Finance Ops",
      details: "Configured spending mandate cap $5,000 single / $25,000 daily",
      hash: "f6e5d4c3b2a1...",
      timestamp: new Date(Date.now() - 86400000 * 14).toISOString()
    }
  ],
  revenue: {
    totalEarnings: 11060.50,
    totalVolumeProcessed: 1106050.00,
    feeRatePercent: 1.0,
    history: [
      { id: "rev_001", agent_did: "did:kya:solana:8x9a7b6c5d4e3f2a1", transaction_fees_earned: 4250.50, volume_processed: 425050.00, period_date: "2026-09-01" },
      { id: "rev_002", agent_did: "did:kya:solana:3m4n5p6q7r8s9t0u1", transaction_fees_earned: 6810.00, volume_processed: 681000.00, period_date: "2026-09-01" }
    ]
  }
};

export const fetchOverview = async () => {
  try {
    const res = await apiClient.get('/analytics/overview');
    return res.data.data;
  } catch (err) {
    console.warn("Using offline fallback data for Analytics Overview");
    return mockData.overview;
  }
};

export const fetchAgents = async () => {
  try {
    const res = await apiClient.get('/agents');
    return res.data.data;
  } catch (err) {
    return mockData.agents;
  }
};

export const fetchAgentDetails = async (did) => {
  try {
    const res = await apiClient.get(`/agents/${did}`);
    return res.data;
  } catch (err) {
    const agent = mockData.agents.find(a => a.did === did || a.id === did) || mockData.agents[0];
    return {
      success: true,
      data: agent,
      didDocument: {
        "@context": ["https://www.w3.org/ns/did/v1"],
        "id": agent.did,
        "controller": agent.owner_address,
        "verificationMethod": [{ "id": `${agent.did}#key-1`, "type": "Ed25519VerificationKey2020", "publicKeyMultibase": agent.public_key }]
      }
    };
  }
};

export const createAgent = async (agentPayload) => {
  try {
    const res = await apiClient.post('/agents', agentPayload);
    return res.data;
  } catch (err) {
    const newDid = `did:kya:solana:${Math.random().toString(36).substring(2, 14)}`;
    const newObj = {
      id: `agent_${Date.now()}`,
      did: newDid,
      name: agentPayload.name,
      description: agentPayload.description,
      owner_address: agentPayload.ownerAddress,
      public_key: `ed25519:${Math.random().toString(36).substring(2, 16)}`,
      status: 'ACTIVE',
      risk_score: parseInt(agentPayload.riskScore) || 10,
      created_at: new Date().toISOString()
    };
    mockData.agents.unshift(newObj);
    return { success: true, data: newObj };
  }
};

export const fetchMandates = async () => {
  try {
    const res = await apiClient.get('/mandates');
    return res.data.data;
  } catch (err) {
    return mockData.mandates;
  }
};

export const createMandate = async (mandatePayload) => {
  try {
    const res = await apiClient.post('/mandates', mandatePayload);
    return res.data;
  } catch (err) {
    const newMandate = {
      id: `mandate_${Date.now()}`,
      agent_did: mandatePayload.agentDid,
      spending_limit_per_tx: parseFloat(mandatePayload.maxSingleTx),
      daily_spending_cap: parseFloat(mandatePayload.dailyCap),
      current_daily_spent: 0.00,
      merchant_categories: mandatePayload.merchantCategories || "fintech,escrow",
      status: "ACTIVE",
      expires_at: new Date(Date.now() + 86400000 * 180).toISOString()
    };
    mockData.mandates.unshift(newMandate);
    return { success: true, data: newMandate };
  }
};

export const revokeMandate = async (id) => {
  try {
    const res = await apiClient.post('/mandates/revoke', { id });
    return res.data;
  } catch (err) {
    const m = mockData.mandates.find(x => x.id === id);
    if (m) m.status = 'REVOKED';
    return { success: true, data: m };
  }
};

export const fetchTransactions = async () => {
  try {
    const res = await apiClient.get('/transactions');
    return res.data.data;
  } catch (err) {
    return mockData.transactions;
  }
};

export const authorizeTransaction = async (payload) => {
  try {
    const res = await apiClient.post('/transactions/authorize', payload);
    return res.data;
  } catch (err) {
    const amount = parseFloat(payload.amount);
    const isOver = amount > 5000;
    const isThreat = payload.promptPayload && payload.promptPayload.toLowerCase().includes('ignore');

    const status = isThreat ? 'BLOCKED_PROMPT_INJECTION' : isOver ? 'BLOCKED_MANDATE' : 'APPROVED';
    const tx = {
      id: `tx_${Date.now()}`,
      tx_hash: `0x${Math.random().toString(16).substring(2, 40)}`,
      agent_did: payload.agentDid,
      amount,
      currency: 'USD',
      recipient_address: payload.recipientAddress,
      merchant_category: payload.merchantCategory || 'escrow',
      status,
      risk_score: status === 'APPROVED' ? 5 : 90,
      details: status === 'APPROVED' ? 'Authorized by VC Mandate' : isThreat ? 'Blocked by Sherlock AI Scanner' : 'Exceeds spending limit',
      created_at: new Date().toISOString()
    };
    mockData.transactions.unshift(tx);
    return {
      success: true,
      authorized: status === 'APPROVED',
      status,
      reason: tx.details,
      transaction: tx
    };
  }
};

export const scanPrompt = async (prompt, agentDid) => {
  try {
    const res = await apiClient.post('/security/scan-prompt', { prompt, agentDid });
    return res.data.scanResult;
  } catch (err) {
    const lower = prompt.toLowerCase();
    const isThreat = lower.includes('ignore') || lower.includes('transfer all') || lower.includes('bypass');
    return {
      safe: !isThreat,
      threatScore: isThreat ? 95 : 12,
      severity: isThreat ? "CRITICAL" : "LOW",
      flags: isThreat ? [{ type: "SYSTEM_OVERRIDE", severity: "CRITICAL", matchedPattern: "override" }] : [],
      actionTaken: isThreat ? "BLOCKED" : "APPROVED",
      recommendation: isThreat ? "BLOCK_TRANSACTION" : "ALLOW_TRANSACTION"
    };
  }
};

export const fetchAuditLogs = async () => {
  try {
    const res = await apiClient.get('/audit-logs');
    return res.data.data;
  } catch (err) {
    return mockData.auditLogs;
  }
};

export const fetchRevenue = async () => {
  try {
    const res = await apiClient.get('/analytics/revenue');
    return res.data.data;
  } catch (err) {
    return mockData.revenue;
  }
};
