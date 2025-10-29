const express = require('express');
const {
  createTransaction,
  getMyTransactions,
  getTransaction
} = require('../controllers/customerController');
const { protect, restrictTo } = require('../middleware/auth');
const { validateTransaction, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes protected and restricted to customers
router.use(protect, restrictTo('customer'));

router.post('/transactions', validateTransaction, handleValidationErrors, createTransaction);
router.get('/transactions', getMyTransactions);
router.get('/transactions/:id', getTransaction);

module.exports = router;