const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
router.post('/authorize', transactionController.authorizeTransaction);

module.exports = router;
