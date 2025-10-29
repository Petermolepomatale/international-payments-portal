const Transaction = require('../models/Transaction');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all pending transactions
exports.getAllPendingTransactions = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({ status: 'pending' })
    .populate('customer', 'fullName accountNumber idNumber')
    .sort('createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments({ status: 'pending' });

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Verify transaction (mark as verified)
exports.verifyTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  
  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  if (transaction.status !== 'pending') {
    return next(new AppError('Transaction already processed', 400));
  }

  transaction.status = 'verified';
  transaction.verifiedAt = new Date();
  await transaction.save();

  await transaction.populate('customer', 'fullName accountNumber');

  res.status(200).json({
    status: 'success',
    message: 'Transaction verified successfully',
    data: {
      transaction
    }
  });
});

// Submit transaction to SWIFT
exports.submitToSWIFT = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  
  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  if (!transaction.canBeSubmitted()) {
    return next(new AppError('Transaction cannot be submitted in its current state', 400));
  }

  // Simulate SWIFT submission process
  // In real implementation, this would integrate with SWIFT API
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random success/failure for demo purposes
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      transaction.status = 'submitted';
      transaction.submittedBy = req.user.id;
      transaction.submittedAt = new Date();
      
      await transaction.save();
      
      res.status(200).json({
        status: 'success',
        message: 'Transaction submitted to SWIFT successfully',
        data: {
          transaction
        }
      });
    } else {
      transaction.status = 'failed';
      transaction.failureReason = 'SWIFT network error - please try again';
      await transaction.save();
      
      return next(new AppError('SWIFT submission failed. Please try again.', 502));
    }
  } catch (error) {
    transaction.status = 'failed';
    transaction.failureReason = 'Internal server error during submission';
    await transaction.save();
    
    return next(new AppError('Failed to submit transaction to SWIFT', 500));
  }
});

// Bulk submit transactions to SWIFT
exports.bulkSubmitToSWIFT = catchAsync(async (req, res, next) => {
  const { transactionIds } = req.body;

  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    return next(new AppError('No transaction IDs provided', 400));
  }

  if (transactionIds.length > 50) {
    return next(new AppError('Cannot submit more than 50 transactions at once', 400));
  }

  const transactions = await Transaction.find({
    _id: { $in: transactionIds },
    status: { $in: ['pending', 'verified'] }
  });

  if (transactions.length === 0) {
    return next(new AppError('No valid transactions found for submission', 404));
  }

  const results = {
    successful: 0,
    failed: 0,
    details: []
  };

  // Process each transaction
  for (const transaction of transactions) {
    try {
      // Simulate SWIFT submission
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (isSuccess) {
        transaction.status = 'submitted';
        transaction.submittedBy = req.user.id;
        transaction.submittedAt = new Date();
        await transaction.save();
        
        results.successful++;
        results.details.push({
          transactionId: transaction._id,
          status: 'success',
          message: 'Submitted to SWIFT'
        });
      } else {
        transaction.status = 'failed';
        transaction.failureReason = 'SWIFT network error';
        await transaction.save();
        
        results.failed++;
        results.details.push({
          transactionId: transaction._id,
          status: 'failed',
          message: 'SWIFT network error'
        });
      }
    } catch (error) {
      results.failed++;
      results.details.push({
        transactionId: transaction._id,
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  res.status(200).json({
    status: 'success',
    message: `Bulk submission completed: ${results.successful} successful, ${results.failed} failed`,
    data: results
  });
});

// Get transaction statistics for dashboard
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const stats = await Transaction.aggregate([
    {
      $facet: {
        totalTransactions: [
          { $count: "count" }
        ],
        pendingTransactions: [
          { $match: { status: "pending" } },
          { $count: "count" }
        ],
        todayTransactions: [
          { 
            $match: {
              createdAt: { $gte: today, $lt: tomorrow }
            }
          },
          { $count: "count" }
        ],
        transactionsByStatus: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        transactionsByCurrency: [
          { $group: { _id: "$currency", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0]
    }
  });
});