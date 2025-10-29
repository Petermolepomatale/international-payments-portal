const User = require('../models/User');
const { createSendToken } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Register new customer
exports.register = catchAsync(async (req, res, next) => {
  const { fullName, idNumber, accountNumber, username, password } = req.body;

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

  // Create new user (automatically customer role)
  const newUser = await User.create({
    fullName,
    idNumber,
    accountNumber,
    username,
    password,
    role: 'customer' // Force customer role for registration
  });

  createSendToken(newUser, 201, res);
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ username, isActive: true }).select('+password +loginAttempts +lockUntil');

  if (!user || !(await user.correctPassword(password, user.password))) {
    // Increment login attempts
    if (user) {
      await user.incrementLoginAttempts();
    }
    
    return next(new AppError('Incorrect username or password', 401));
  }

  // 3) Reset login attempts on successful login
  if (user.loginAttempts > 0 || user.lockUntil) {
    await User.findByIdAndUpdate(user._id, {
      $set: { loginAttempts: 0 },
      $unset: { lockUntil: 1 }
    });
  }

  // 4) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// Logout user
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Get current user
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// Update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});