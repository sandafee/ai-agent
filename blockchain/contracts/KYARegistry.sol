// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KYARegistry
 * @dev Know Your Agent (KYA) Smart Contract Registry for On-Chain Agent DIDs,
 * Verifiable Mandates, and Authorization State Enforcement.
 */
contract KYARegistry {
    address public admin;

    enum AgentStatus { Active, Suspended, Revoked }

    struct Agent {
        string did;
        address owner;
        string publicKey;
        AgentStatus status;
        uint256 riskScore;
        uint256 registeredAt;
    }

    struct Mandate {
        bytes32 mandateId;
        string agentDid;
        bytes32 vcHash;
        uint256 spendingLimitPerTx;
        uint256 dailySpendingCap;
        bool active;
        uint256 expiresAt;
    }

    // Mapping agent DID => Agent
    mapping(string => Agent) public agents;
    // Mapping agent DID => Active Mandate
    mapping(string => Mandate) public agentMandates;
    // Track total registered agents
    string[] public agentDids;

    // Events
    event AgentRegistered(string indexed did, address indexed owner, uint256 timestamp);
    event AgentStatusUpdated(string indexed did, AgentStatus status);
    event MandateIssued(string indexed did, bytes32 indexed mandateId, uint256 spendingLimitPerTx, uint256 dailySpendingCap);
    event MandateRevoked(string indexed did, bytes32 indexed mandateId);
    event TransactionVerified(string indexed did, uint256 amount, string merchantCategory, bool approved, string reason);

    modifier onlyAdmin() {
        require(msg.sender == admin, "KYARegistry: caller is not the admin");
        _;
    }

    modifier onlyAgentOwner(string memory did) {
        require(agents[did].owner == msg.sender || msg.sender == admin, "KYARegistry: caller is not agent owner");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Register a new AI Agent with its cryptographic DID and Public Key.
     */
    function registerAgent(
        string memory did,
        string memory publicKey,
        uint256 riskScore
    ) external {
        require(bytes(did).length > 0, "KYARegistry: DID cannot be empty");
        require(agents[did].owner == address(0), "KYARegistry: Agent already registered");

        agents[did] = Agent({
            did: did,
            owner: msg.sender,
            publicKey: publicKey,
            status: AgentStatus.Active,
            riskScore: riskScore,
            registeredAt: block.timestamp
        });

        agentDids.push(did);

        emit AgentRegistered(did, msg.sender, block.timestamp);
    }

    /**
     * @dev Update Agent Operational Status.
     */
    function updateAgentStatus(string memory did, AgentStatus newStatus) external onlyAgentOwner(did) {
        require(agents[did].owner != address(0), "KYARegistry: Agent does not exist");
        agents[did].status = newStatus;
        emit AgentStatusUpdated(did, newStatus);
    }

    /**
     * @dev Issue an on-chain Mandate cryptographic proof anchoring VC spending limits.
     */
    function issueMandate(
        string memory did,
        bytes32 mandateId,
        bytes32 vcHash,
        uint256 spendingLimitPerTx,
        uint256 dailySpendingCap,
        uint256 durationSeconds
    ) external onlyAgentOwner(did) {
        require(agents[did].owner != address(0), "KYARegistry: Agent does not exist");
        require(agents[did].status == AgentStatus.Active, "KYARegistry: Agent is not active");

        agentMandates[did] = Mandate({
            mandateId: mandateId,
            agentDid: did,
            vcHash: vcHash,
            spendingLimitPerTx: spendingLimitPerTx,
            dailySpendingCap: dailySpendingCap,
            active: true,
            expiresAt: block.timestamp + durationSeconds
        });

        emit MandateIssued(did, mandateId, spendingLimitPerTx, dailySpendingCap);
    }

    /**
     * @dev Revoke an existing Mandate.
     */
    function revokeMandate(string memory did) external onlyAgentOwner(did) {
        Mandate storage mandate = agentMandates[did];
        require(mandate.active, "KYARegistry: No active mandate found");
        mandate.active = false;
        emit MandateRevoked(did, mandate.mandateId);
    }

    /**
     * @dev On-chain verification of a proposed transaction against the agent mandate.
     */
    function verifyTransaction(
        string memory did,
        uint256 amount
    ) external returns (bool approved, string memory reason) {
        Agent storage agent = agents[did];
        if (agent.owner == address(0)) {
            emit TransactionVerified(did, amount, "", false, "Agent not found");
            return (false, "Agent not found");
        }

        if (agent.status != AgentStatus.Active) {
            emit TransactionVerified(did, amount, "", false, "Agent suspended or revoked");
            return (false, "Agent suspended or revoked");
        }

        Mandate storage mandate = agentMandates[did];
        if (!mandate.active) {
            emit TransactionVerified(did, amount, "", false, "No active mandate");
            return (false, "No active mandate");
        }

        if (block.timestamp > mandate.expiresAt) {
            emit TransactionVerified(did, amount, "", false, "Mandate expired");
            return (false, "Mandate expired");
        }

        if (amount > mandate.spendingLimitPerTx) {
            emit TransactionVerified(did, amount, "", false, "Exceeds single transaction limit");
            return (false, "Exceeds single transaction limit");
        }

        emit TransactionVerified(did, amount, "", true, "Transaction authorized by mandate");
        return (true, "Transaction authorized by mandate");
    }

    /**
     * @dev Get total registered agents count.
     */
    function getAgentCount() external view returns (uint256) {
        return agentDids.length;
    }
}
