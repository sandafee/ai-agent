const express = require('express');
const router = express.Router();
const didController = require('../controllers/didController');

router.get('/:did', didController.resolveDid);
router.post('/register', didController.registerDid);

module.exports = router;
