const db = require('./db');

class MandateModel {
  static findAll() {
    return db.getCollection('mandates');
  }

  static findByAgentDid(agentDid) {
    return db.findOne('mandates', 'agent_did', agentDid);
  }

  static findById(id) {
    return db.findOne('mandates', 'id', id);
  }

  static create(mandateData) {
    return db.insert('mandates', mandateData);
  }

  static updateStatus(id, status) {
    return db.update('mandates', 'id', id, { status });
  }

  static addSpent(agentDid, amount) {
    const mandate = this.findByAgentDid(agentDid);
    if (mandate) {
      const current = parseFloat(mandate.current_daily_spent || 0);
      const updatedSpent = current + parseFloat(amount);
      return db.update('mandates', 'agent_did', agentDid, { current_daily_spent: updatedSpent });
    }
    return null;
  }
}

module.exports = MandateModel;
