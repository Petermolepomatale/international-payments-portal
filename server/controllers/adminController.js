const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Create new user (admin only)
exports.createUser = catchAsync(async (req, res, next) => {
  const { fullName, idNumber, accountNumber, username, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      { idNumber },
      { accountNumber },
      { username }
    ]
  });

  if (existingUser) {
    let field = '';
    if (existingUser.idNumber === idNumber) field = 'ID number';
    else if (existingUser.accountNumber === accountNumber) field = 'account number';
    else field = 'username';
    
    return next(new AppError(`User with this ${field} already exists`, 400));
  }

  // Create new user
  const newUser = await User.create({
    fullName,
    idNumber,
    accountNumber,
    username,
    password,
    role: role || 'customer' // Default to customer if not specified
  });

  // Remove password from output
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user: newUser
    }
  });
});

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find({ isActive: true })
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ isActive: true });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Update user
exports.updateUser = catchAsync(async (req, res, next) => {
  const { fullName, role, isActive } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { fullName, role, isActive },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Delete user (soft delete)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'User deactivated successfully'
  });
});