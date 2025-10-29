const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s]{2,50}$/.test(v);
      },
      message: 'Full name must contain only letters and spaces (2-50 characters)'
    }
  },
  idNumber: {
    type: String,
    required: [true, 'ID number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{13}$/.test(v);
      },
      message: 'ID number must be exactly 13 digits'
    }
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10,12}$/.test(v);
      },
      message: 'Account number must be 10-12 digits'
    }
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9_]{3,20}$/.test(v);
      },
      message: 'Username must be 3-20 characters (lowercase letters, numbers, underscore only)'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Never return password in queries
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['customer', 'employee'],
      message: 'Role must be either customer or employee'
    },
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Index for better query performance
userSchema.index({ username: 1 });
userSchema.index({ idNumber: 1 });
userSchema.index({ accountNumber: 1 });
userSchema.index({ role: 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordResetToken fields if password is changed
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;

  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Ensure token is created after password change
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method for handling failed login attempts
userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  // Otherwise increment
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

module.exports = mongoose.model('User', userSchema);