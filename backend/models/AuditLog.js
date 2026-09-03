const db = require('./db');
const crypto = require('crypto');

class AuditLogModel {
  static findAll() {
    return db.getCollection('audit_logs');
  }

  static log(entityType, entityId, action, actor, details) {
    const timestamp = new Date().toISOString();
    const hash = crypto.createHash('sha256').update(`${entityType}:${entityId}:${action}:${actor}:${timestamp}`).digest('hex');

    const entry = {
      id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      entity_type: entityType,
      entity_id: entityId,
      action: action,
      actor: actor,
      details: details,
      hash: hash,
      timestamp: timestamp
    };

    return db.insert('audit_logs', entry);
  }
}

module.exports = AuditLogModel;
