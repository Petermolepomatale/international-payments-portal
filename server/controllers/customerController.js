const Transaction = require('../models/Transaction');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Create new transaction
exports.createTransaction = catchAsync(async (req, res, next) => {
  const {
    amount,
    currency,
    provider,
    payeeAccount,
    swiftCode,
    payeeName,
    payeeBank,
    purpose
  } = req.body;

  // Additional server-side validation
  if (amount <= 0) {
    return next(new AppError('Amount must be greater than 0', 400));
  }

  // Check for duplicate pending transaction (same customer, amount, payee within last hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const duplicateTransaction = await Transaction.findOne({
    customer: req.user.id,
    amount,
    payeeAccount,
    status: 'pending',
    createdAt: { $gte: oneHourAgo }
  });

  if (duplicateTransaction) {
    return next(new AppError('Similar transaction already pending. Please wait or contact support.', 400));
  }

  const transaction = await Transaction.create({
    customer: req.user.id,
    amount,
    currency,
    provider,
    payeeAccount: payeeAccount.toUpperCase(),
    swiftCode: swiftCode.toUpperCase(),
    payeeName,
    payeeBank,
    purpose: purpose || '',
    status: 'pending'
  });

  // Populate customer details for response
  await transaction.populate('customer', 'fullName accountNumber');

  res.status(201).json({
    status: 'success',
    data: {
      transaction
    }
  });
});

// Get customer's transactions
exports.getMyTransactions = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find({ customer: req.user.id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('submittedBy', 'fullName');

  const total = await Transaction.countDocuments({ customer: req.user.id });

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

// Get transaction by ID (must belong to customer)
exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    customer: req.user.id
  }).populate('customer', 'fullName accountNumber')
    .populate('submittedBy', 'fullName');

  if (!transaction) {
    return next(new AppError('No transaction found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      transaction
    }
  });
});