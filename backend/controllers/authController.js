const AuditLogModel = require('../models/AuditLog');

const DEMO_USERS = [
  {
    id: "usr_regulator_01",
    name: "Central Bank Regulator",
    role: "REGULATOR",
    email: "regulator@centralbank.gov",
    organization: "Central Bank AI Authority Root",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    did: "did:kya:authority:central-bank-mainnet"
  },
  {
    id: "usr_agent_owner_02",
    name: "Apex Finance Escrow Lead",
    role: "AGENT_OWNER",
    email: "ops@apexfinance.io",
    organization: "Apex Finance Escrow Infrastructure",
    walletAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    did: "did:kya:solana:8x9a7b6c5d4e3f2a1"
  }
];

exports.login = (req, res, next) => {
  try {
    const { email, password, walletAddress, role } = req.body;

    let user = null;
    if (walletAddress) {
      user = DEMO_USERS.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase()) || {
        id: `usr_${Date.now()}`,
        name: `Wallet User (${walletAddress.substring(0, 6)}...)`,
        role: "AGENT_OWNER",
        email: `${walletAddress.substring(0, 8)}@kya.wallet`,
        organization: "Autonomous AI Principal",
        walletAddress: walletAddress,
        did: `did:kya:solana:${walletAddress.substring(2, 14)}`
      };
    } else if (email) {
      user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        role: role || "REGULATOR",
        email: email,
        organization: "KYA Ecosystem Partner",
        walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        did: "did:kya:authority:general"
      };
    } else {
      user = DEMO_USERS[0];
    }

    const token = `kya_jwt_token_${Date.now()}_${user.id}`;
    AuditLogModel.log('USER', user.id, 'LOGIN', user.name, `Authenticated as ${user.role} via ${walletAddress ? 'Web3 Signature' : 'Credentials'}`);

    res.json({
      success: true,
      message: 'Authentication successful',
      token: token,
      user: user
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  try {
    res.json({
      success: true,
      user: DEMO_USERS[0]
    });
  } catch (err) {
    next(err);
  }
};
