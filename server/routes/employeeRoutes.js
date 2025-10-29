const express = require('express');
const {
  getAllPendingTransactions,
  verifyTransaction,
  submitToSWIFT,
  bulkSubmitToSWIFT,
  getDashboardStats
} = require('../controllers/employeeController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes protected and restricted to employees
router.use(protect, restrictTo('employee'));

router.get('/transactions/pending', getAllPendingTransactions);
router.patch('/transactions/:id/verify', verifyTransaction);
router.patch('/transactions/:id/submit', submitToSWIFT);
router.post('/transactions/bulk-submit', bulkSubmitToSWIFT);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;