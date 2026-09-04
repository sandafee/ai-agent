require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

// Middleware
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Routes
const authRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');
const mandateRoutes = require('./routes/mandateRoutes');
const didRoutes = require('./routes/didRoutes');
const credentialRoutes = require('./routes/credentialRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const securityRoutes = require('./routes/securityRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(authMiddleware);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'KYA Protocol Backend Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);

app.use('/api/mandates', mandateRoutes);
app.use('/api/dids', didRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found` });
});

// Global Error Handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🛡️  KYA (Know Your Agent) Core Backend Running`);
    console.log(`🚀  Port: http://localhost:${PORT}`);
    console.log(`📡  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
}

module.exports = app;
