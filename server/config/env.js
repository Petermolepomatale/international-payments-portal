const dotenv = require('dotenv');

// Load env file based on environment
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  DATABASE: process.env.DATABASE || 'mongodb://localhost:27017/international_payments',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '90d',
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || 90,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100
};