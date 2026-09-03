const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credentialController');

router.post('/issue', credentialController.issueCredential);
router.post('/verify', credentialController.verifyCredential);

module.exports = router;
