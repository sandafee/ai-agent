-- KYA (Know Your Agent) Database Schema
-- Standard ANSI SQL / SQLite / PostgreSQL Compatible

-- 1. Agents Table
CREATE TABLE IF NOT EXISTS agents (
    id VARCHAR(64) PRIMARY KEY,
    did VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_address VARCHAR(128) NOT NULL,
    public_key TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, REVOKED
    risk_score INTEGER DEFAULT 12, -- 0 to 100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mandates Table (Verifiable Credentials encapsulated spending rules)
CREATE TABLE IF NOT EXISTS mandates (
    id VARCHAR(64) PRIMARY KEY,
    agent_did VARCHAR(128) NOT NULL,
    vc_jwt TEXT,
    spending_limit_per_tx DECIMAL(15, 2) NOT NULL,
    daily_spending_cap DECIMAL(15, 2) NOT NULL,
    current_daily_spent DECIMAL(15, 2) DEFAULT 0.00,
    merchant_categories TEXT NOT NULL, -- Comma-separated or JSON list e.g. "fintech,escrow,micro-lending"
    status VARCHAR(32) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, REVOKED
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_did) REFERENCES agents(did) ON DELETE CASCADE
);

-- 3. Credentials Table (W3C Verifiable Credentials Registry)
CREATE TABLE IF NOT EXISTS credentials (
    id VARCHAR(64) PRIMARY KEY,
    agent_did VARCHAR(128) NOT NULL,
    vc_type VARCHAR(128) NOT NULL, -- AgentMandateCredential, IdentityCredential, RiskAssessmentCredential
    issuer_did VARCHAR(128) NOT NULL,
    vc_payload TEXT NOT NULL, -- JSON string payload
    proof_signature TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'ISSUED', -- ISSUED, REVOKED, EXPIRED
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (agent_did) REFERENCES agents(did) ON DELETE CASCADE
);

-- 4. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    tx_hash VARCHAR(128) UNIQUE NOT NULL,
    agent_did VARCHAR(128) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(16) DEFAULT 'USD',
    recipient_address VARCHAR(128) NOT NULL,
    merchant_category VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL, -- APPROVED, BLOCKED_MANDATE, BLOCKED_PROMPT_INJECTION, PENDING
    risk_score INTEGER DEFAULT 5,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_did) REFERENCES agents(did) ON DELETE CASCADE
);

-- 5. Security Logs Table (Sherlock Prompt Injection & Threat Scanner)
CREATE TABLE IF NOT EXISTS security_logs (
    id VARCHAR(64) PRIMARY KEY,
    agent_did VARCHAR(128) NOT NULL,
    threat_type VARCHAR(64) NOT NULL, -- SYSTEM_OVERRIDE, WALLET_DRAIN, PROMPT_INJECTION, MANDATE_BREACH
    prompt_payload TEXT NOT NULL,
    action_taken VARCHAR(32) NOT NULL, -- BLOCKED, FLAGGED, IGNORED
    severity VARCHAR(16) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
    risk_score INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_did) REFERENCES agents(did) ON DELETE CASCADE
);

-- 6. Audit Logs Table (Central Bank & Regulatory Compliance Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL, -- AGENT, MANDATE, TRANSACTION, SECURITY
    entity_id VARCHAR(128) NOT NULL,
    action VARCHAR(64) NOT NULL, -- CREATED, UPDATED, REVOKED, AUTHORIZED, BLOCKED
    actor VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    hash VARCHAR(128) NOT NULL, -- Cryptographic hash of audit log entry for immutability
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Revenue Stats Table
CREATE TABLE IF NOT EXISTS revenue_stats (
    id VARCHAR(64) PRIMARY KEY,
    agent_did VARCHAR(128) NOT NULL,
    transaction_fees_earned DECIMAL(15, 2) DEFAULT 0.00,
    volume_processed DECIMAL(15, 2) DEFAULT 0.00,
    period_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_did) REFERENCES agents(did) ON DELETE CASCADE
);
