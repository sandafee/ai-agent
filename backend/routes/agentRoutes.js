const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.get('/', agentController.getAllAgents);
router.post('/', agentController.createAgent);
router.get('/:did', agentController.getAgentByDid);
router.patch('/:id/status', agentController.updateAgentStatus);

module.exports = router;
