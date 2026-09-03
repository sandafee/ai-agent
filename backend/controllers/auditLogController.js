const AuditLogModel = require('../models/AuditLog');

exports.getAuditLogs = (req, res, next) => {
  try {
    const logs = AuditLogModel.findAll();
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

exports.exportAuditLogs = (req, res, next) => {
  try {
    const format = req.query.format || 'json';
    const logs = AuditLogModel.findAll();

    if (format === 'csv') {
      const header = 'id,entity_type,entity_id,action,actor,details,hash,timestamp\n';
      const rows = logs.map(l =>
        `"${l.id}","${l.entity_type}","${l.entity_id}","${l.action}","${l.actor}","${l.details.replace(/"/g, '""')}","${l.hash}","${l.timestamp}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="kya_audit_logs.csv"');
      return res.send(header + rows);
    }

    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};
