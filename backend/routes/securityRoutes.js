const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');

router.post('/scan-prompt', securityController.scanPrompt);
router.get('/threats', securityController.getSecurityLogs);

module.exports = router;
