# KYA - Know Your Agent System (PS05 Protocol)

> **Decentralized Identity, Verifiable Mandates & Prompt Injection Firewall Infrastructure for Autonomous AI Financial Agents**

[![W3C Verifiable Credentials](https://img.shields.io/badge/W3C-Verifiable_Credentials_v1.1-blue.svg)](https://www.w3.org/TR/vc-data-model/)
[![DID Standard](https://img.shields.io/badge/DID-did%3Akya%3Asolana-00f0ff.svg)](https://w3c.github.io/did-core/)
[![Sherlock Security](https://img.shields.io/badge/Sherlock-Prompt_Injection_Guard-red.svg)](docs/architecture.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Directory Structure

```
KYA/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Agents.jsx
│   │   │   ├── AgentDetails.jsx
│   │   │   ├── Mandates.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Revenue.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AuditLogs.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── VerificationBadge.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── PromptScanner.jsx
│   │   └── services/
│   │       └── api.js
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   │   ├── didService.js
│   │   ├── credentialService.js
│   │   ├── authorizationService.js
│   │   ├── blockchainService.js
│   │   └── securityService.js
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── blockchain/
│   ├── contracts/
│   │   └── KYARegistry.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── KYARegistry.test.js
│   └── hardhat.config.js
│
├── database/
│   └── schema.sql
│
├── docs/
│   ├── architecture.md
│   └── api.md
│
├── .env
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Install & Start Backend API Server

```bash
cd backend
npm install
npm start
```
*The Express backend server runs on `http://localhost:5000`.*

### 2. Install & Start Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```
*The React Dashboard runs on `http://localhost:3000` (or Vite port).*

### 3. Smart Contracts (Hardhat)

```bash
cd blockchain
npm install
npm run compile
npm test
```

---

## 🛡️ Core System Features

- **W3C DID Registry**: Issues cryptographic `did:kya:solana:...` DIDs linked to legal human principals.
- **Verifiable Credential Mandate Engine**: Spending limits, daily caps, merchant whitelists, Ed25519 signature proofs.
- **Sherlock Prompt Injection Scanner**: Real-time scanner catching system instruction overrides, wallet drain attempts, and cap evasion vectors.
- **Payment Rail Simulator**: Test agent payment authorizations against M-Pesa, Solana, and Escrow rails in real time.
- **Central Bank Regulatory Compliance Console**: Printable regulatory certificates and 1-click CSV/JSON cryptographic audit log exports.
