const db = require('./db');

class AgentModel {
  static findAll() {
    return db.getCollection('agents');
  }

  static findByDid(did) {
    return db.findOne('agents', 'did', did);
  }

  static findById(id) {
    return db.findOne('agents', 'id', id);
  }

  static create(agentData) {
    return db.insert('agents', agentData);
  }

  static updateStatus(did, status) {
    return db.update('agents', 'did', did, { status });
  }
}

module.exports = AgentModel;
