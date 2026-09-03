const express = require('express');
const router = express.Router();
const mandateController = require('../controllers/mandateController');

router.get('/', mandateController.getAllMandates);
router.post('/', mandateController.createMandate);
router.get('/:agentDid', mandateController.getMandateByAgentDid);
router.post('/revoke', mandateController.revokeMandate);

module.exports = router;
