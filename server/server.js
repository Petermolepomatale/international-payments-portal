const express = require('express');
const https = require('https');
const http = require('http');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const securityMiddleware = require('./middleware/security');
const { 
  generalLimiter, 
  speedLimiter, 
  sanitizeInput, 
  preventSQLInjection, 
  requestSizeLimiter, 
  suspiciousActivityDetector 
} = require('./middleware/advancedSecurity');
const { getSSLOptions, forceHTTPS, httpsSecurityHeaders } = require('./config/ssl');
const { PORT, NODE_ENV } = require('./config/env');

// Import routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import error handling middleware
const globalErrorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Force HTTPS in production
if (NODE_ENV === 'production') {
  app.use(forceHTTPS);
}

// HTTPS security headers
app.use(httpsSecurityHeaders);

// Advanced security middleware
app.use(requestSizeLimiter);
app.use(suspiciousActivityDetector);
app.use(generalLimiter);
app.use(speedLimiter);
app.use(sanitizeInput);
app.use(preventSQLInjection);

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
app.use('/api/admin', adminRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start server with HTTPS support
const sslOptions = getSSLOptions();
let server;

if (sslOptions && NODE_ENV === 'production') {
  // Production HTTPS server
  server = https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔒 HTTPS Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`🌍 Access at: https://localhost:${PORT}`);
  });
} else if (sslOptions && NODE_ENV === 'development') {
  // Development HTTPS server
  server = https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔒 Development HTTPS Server running on port ${PORT}`);
    console.log(`🌍 Access at: https://localhost:${PORT}`);
    console.log(`⚠️  Using self-signed certificate - browser will show security warning`);
  });
} else {
  // Fallback HTTP server
  server = http.createServer(app).listen(PORT, () => {
    console.log(`🚀 HTTP Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`🌍 Access at: http://localhost:${PORT}`);
    if (NODE_ENV === 'production') {
      console.log(`⚠️  WARNING: Running HTTP in production is not secure!`);
    }
  });
}

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