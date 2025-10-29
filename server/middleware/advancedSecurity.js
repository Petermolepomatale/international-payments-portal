const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// Advanced rate limiting for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'fail',
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 'fail',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Specific rate limiters
const loginLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts. Please try again in 15 minutes.'
);

const transactionLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 transactions per minute
  'Too many transaction requests. Please slow down.'
);

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests from this IP. Please try again later.'
);

// Speed limiter (progressive delay)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potential script tags
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  };

  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return typeof obj === 'string' ? sanitizeString(obj) : obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

// SQL injection prevention (additional layer)
const preventSQLInjection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\'|\"|;|--|\*|\|)/,
    /(\bOR\b|\bAND\b).*(\=|\<|\>)/i
  ];

  const checkForSQL = (value) => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    return false;
  };

  const checkObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (checkObject(obj[key])) return true;
        } else if (checkForSQL(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    return next(new AppError('Invalid input detected', 400));
  }

  next();
};

// CSRF protection for state-changing operations
const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionToken = req.session?.csrfToken;

    if (!token || !sessionToken || token !== sessionToken) {
      return next(new AppError('Invalid CSRF token', 403));
    }
  }
  next();
};

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 1024 * 1024; // 1MB

  if (contentLength > maxSize) {
    return next(new AppError('Request entity too large', 413));
  }

  next();
};

// Suspicious activity detector
const suspiciousActivityDetector = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\.\//g, // Directory traversal
    /%2e%2e%2f/gi, // Encoded directory traversal
    /<script/gi, // Script tags
    /javascript:/gi, // JavaScript protocol
    /vbscript:/gi, // VBScript protocol
    /onload=/gi, // Event handlers
    /onerror=/gi,
    /eval\(/gi, // Eval function
    /expression\(/gi // CSS expression
  ];

  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers.referer || '';
  const requestUrl = req.originalUrl;

  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(requestUrl) || 
    pattern.test(userAgent) || 
    pattern.test(referer) ||
    pattern.test(JSON.stringify(req.body))
  );

  if (isSuspicious) {
    console.warn(`Suspicious activity detected from IP: ${req.ip}, URL: ${requestUrl}`);
    return next(new AppError('Suspicious activity detected', 400));
  }

  next();
};

module.exports = {
  loginLimiter,
  transactionLimiter,
  generalLimiter,
  speedLimiter,
  sanitizeInput,
  preventSQLInjection,
  csrfProtection,
  requestSizeLimiter,
  suspiciousActivityDetector
};