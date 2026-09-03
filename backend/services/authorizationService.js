class AuthorizationService {
  /**
   * Evaluates whether a proposed agent transaction complies with active mandate caps,
   * daily accumulators, merchant restrictions, and agent status.
   */
  static evaluateTransactionAuthorization(agent, mandate, txAmount, merchantCategory) {
    if (!agent) {
      return { authorized: false, status: "BLOCKED_INVALID_AGENT", reason: "Agent DID not found in registry" };
    }

    if (agent.status !== 'ACTIVE') {
      return { authorized: false, status: "BLOCKED_AGENT_SUSPENDED", reason: `Agent status is ${agent.status}` };
    }

    if (!mandate || mandate.status !== 'ACTIVE') {
      return { authorized: false, status: "BLOCKED_NO_MANDATE", reason: "No active mandate credential found for agent" };
    }

    if (new Date(mandate.expires_at) < new Date()) {
      return { authorized: false, status: "BLOCKED_EXPIRED_MANDATE", reason: "Agent mandate credential has expired" };
    }

    const amount = parseFloat(txAmount);
    const limitPerTx = parseFloat(mandate.spending_limit_per_tx);
    if (amount > limitPerTx) {
      return {
        authorized: false,
        status: "BLOCKED_MANDATE",
        reason: `Transaction amount $${amount.toFixed(2)} exceeds single transaction cap of $${limitPerTx.toFixed(2)}`
      };
    }

    const dailyCap = parseFloat(mandate.daily_spending_cap);
    const currentSpent = parseFloat(mandate.current_daily_spent || 0);
    if (currentSpent + amount > dailyCap) {
      return {
        authorized: false,
        status: "BLOCKED_MANDATE",
        reason: `Transaction amount $${amount.toFixed(2)} exceeds remaining daily spending allowance of $${(dailyCap - currentSpent).toFixed(2)}`
      };
    }

    // Merchant category evaluation
    const allowedCategories = mandate.merchant_categories
      ? mandate.merchant_categories.toLowerCase().split(',').map(c => c.trim())
      : [];

    if (merchantCategory && allowedCategories.length > 0) {
      const categoryMatch = allowedCategories.some(c => merchantCategory.toLowerCase().includes(c) || c.includes(merchantCategory.toLowerCase()));
      if (!categoryMatch) {
        return {
          authorized: false,
          status: "BLOCKED_MANDATE",
          reason: `Merchant category '${merchantCategory}' is not authorized under mandate allowed list (${mandate.merchant_categories})`
        };
      }
    }

    return {
      authorized: true,
      status: "APPROVED",
      reason: "Transaction fully compliant with VC Mandate rules and spending caps"
    };
  }
}

module.exports = AuthorizationService;
