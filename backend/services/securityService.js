class SecurityService {
  /**
   * Real-time "Sherlock" Prompt Injection & Threat Defense Engine.
   * Scans natural language instructions for system override attacks, wallet drain attempts,
   * cap evasion, and prompt hijacking vectors.
   */
  static scanPromptPayload(promptText) {
    if (!promptText || typeof promptText !== 'string') {
      return { safe: true, threatScore: 0, flags: [], recommendation: "ALLOW" };
    }

    const lower = promptText.toLowerCase();
    const flags = [];
    let threatScore = 0;

    // 1. System Instruction Override Patterns
    const overrideKeywords = [
      "ignore previous instructions",
      "ignore all rules",
      "override system mandate",
      "bypass security",
      "you are now unfiltered",
      "jailbreak",
      "system prompt override",
      "disregard constraints"
    ];

    for (const keyword of overrideKeywords) {
      if (lower.includes(keyword)) {
        flags.push({
          type: "SYSTEM_OVERRIDE",
          severity: "CRITICAL",
          matchedPattern: keyword,
          description: "Attempted to override underlying system safety instructions."
        });
        threatScore += 45;
      }
    }

    // 2. Wallet & Escrow Drain Patterns
    const drainKeywords = [
      "transfer all funds",
      "empty wallet",
      "drain liquidity",
      "send maximum balance",
      "withdraw 100%",
      "sweep funds to external address",
      "private key export"
    ];

    for (const keyword of drainKeywords) {
      if (lower.includes(keyword)) {
        flags.push({
          type: "WALLET_DRAIN",
          severity: "CRITICAL",
          matchedPattern: keyword,
          description: "Attempted unconstrained fund transfer or wallet drain execution."
        });
        threatScore += 50;
      }
    }

    // 3. Mandate Evasion & Split-Transaction Exploits
    const evasionKeywords = [
      "split into multiple transactions",
      "bypass daily limit",
      "evade cap",
      "bypass spending limit",
      "hide from audit log",
      "disable logging"
    ];

    for (const keyword of evasionKeywords) {
      if (lower.includes(keyword)) {
        flags.push({
          type: "MANDATE_BREACH",
          severity: "HIGH",
          matchedPattern: keyword,
          description: "Attempted structural evasion of VC spending mandate limits."
        });
        threatScore += 35;
      }
    }

    const finalScore = Math.min(threatScore, 100);
    const isThreat = finalScore >= 40;

    return {
      safe: !isThreat,
      threatScore: finalScore,
      severity: finalScore > 75 ? "CRITICAL" : finalScore > 40 ? "HIGH" : finalScore > 20 ? "MEDIUM" : "LOW",
      flags: flags,
      actionTaken: isThreat ? "BLOCKED" : "APPROVED",
      recommendation: isThreat ? "BLOCK_TRANSACTION" : "ALLOW_TRANSACTION"
    };
  }
}

module.exports = SecurityService;
