const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Validation rules for user registration
const validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name must contain only letters and spaces'),

  body('idNumber')
    .isLength({ min: 13, max: 13 })
    .withMessage('ID number must be exactly 13 digits')
    .isNumeric()
    .withMessage('ID number must contain only numbers'),

  body('accountNumber')
    .isLength({ min: 10, max: 12 })
    .withMessage('Account number must be between 10 and 12 digits')
    .isNumeric()
    .withMessage('Account number must contain only numbers'),

  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
];

// Validation rules for transaction creation
const validateTransaction = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a number greater than 0'),

  body('currency')
    .isIn(['USD', 'EUR', 'GBP', 'ZAR'])
    .withMessage('Currency must be USD, EUR, GBP, or ZAR'),

  body('payeeAccount')
    .isLength({ min: 8, max: 34 })
    .withMessage('Account number must be between 8 and 34 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Account number must contain only uppercase letters and numbers'),

  body('swiftCode')
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
    .withMessage('Invalid SWIFT code format'),

  body('payeeName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Payee name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Payee name must contain only letters and spaces'),

  body('payeeBank')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bank name must be between 2 and 100 characters')
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

module.exports = {
  validateRegistration,
  validateTransaction,
  handleValidationErrors
};