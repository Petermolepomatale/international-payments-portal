const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const securityMiddleware = require('./middleware/security');
const { PORT, NODE_ENV } = require('./config/env');

// Import routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Import error handling middleware
const globalErrorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security middleware
securityMiddleware(app);

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser middleware
app.use(cookieParser());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'International Payments Portal API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/employee', employeeRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app;