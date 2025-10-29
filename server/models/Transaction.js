const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a customer']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0.01, 'Amount must be greater than 0'],
    validate: {
      validator: function(v) {
        return /^\d+(\.\d{1,2})?$/.test(v.toString());
      },
      message: 'Amount must be a valid number with up to 2 decimal places'
    }
  },
  currency: {
    type: String,
    required: [true, 'Please provide a currency'],
    enum: {
      values: ['USD', 'EUR', 'GBP', 'ZAR'],
      message: 'Currency must be USD, EUR, GBP, or ZAR'
    },
    default: 'USD'
  },
  provider: {
    type: String,
    required: [true, 'Please provide a provider'],
    enum: {
      values: ['SWIFT'],
      message: 'Provider must be SWIFT'
    },
    default: 'SWIFT'
  },
  payeeAccount: {
    type: String,
    required: [true, 'Please provide payee account number'],
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{8,34}$/.test(v);
      },
      message: 'Invalid account number format (8-34 alphanumeric characters)'
    }
  },
  swiftCode: {
    type: String,
    required: [true, 'Please provide SWIFT code'],
    validate: {
      validator: function(v) {
        return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v);
      },
      message: 'Invalid SWIFT code format'
    }
  },
  payeeName: {
    type: String,
    required: [true, 'Please provide payee name'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]{2,100}$/.test(v);
      },
      message: 'Payee name must contain only letters and spaces (2-100 characters)'
    }
  },
  payeeBank: {
    type: String,
    required: [true, 'Please provide payee bank name'],
    trim: true,
    maxlength: [100, 'Bank name cannot exceed 100 characters']
  },
  purpose: {
    type: String,
    trim: true,
    maxlength: [200, 'Purpose cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'verified', 'submitted', 'completed', 'failed'],
      message: 'Status must be pending, verified, submitted, completed, or failed'
    },
    default: 'pending'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submittedAt: Date,
  verifiedAt: Date,
  completedAt: Date,
  failureReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
transactionSchema.index({ customer: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ submittedBy: 1 });

// Virtual for transaction age in days
transactionSchema.virtual('ageInDays').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static method to get transactions by status
transactionSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('customer', 'fullName accountNumber idNumber');
};

// Instance method to check if transaction can be submitted
transactionSchema.methods.canBeSubmitted = function() {
  return this.status === 'pending' || this.status === 'verified';
};

module.exports = mongoose.model('Transaction', transactionSchema);