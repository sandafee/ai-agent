const db = require('./db');

class TransactionModel {
  static findAll() {
    return db.getCollection('transactions');
  }

  static findById(id) {
    return db.findOne('transactions', 'id', id);
  }

  static findByAgentDid(agentDid) {
    return db.getCollection('transactions').filter(t => t.agent_did === agentDid);
  }

  static create(txData) {
    return db.insert('transactions', txData);
  }
}

module.exports = TransactionModel;
