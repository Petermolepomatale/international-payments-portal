const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS, FRONTEND_URL } = require('../config/env');

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: parseInt(RATE_LIMIT_WINDOW_MS),
  max: parseInt(RATE_LIMIT_MAX_REQUESTS),
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (FRONTEND_URL.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Security headers configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", FRONTEND_URL]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' }, // Clickjacking protection
  noSniff: true,
  hidePoweredBy: true
};

const securityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet(helmetConfig));

  // Enable CORS
  app.use(cors(corsOptions));

  // Rate limiting
  app.use('/api/', limiter);

  // Body parser middleware (should be before sanitization)
  app.use(require('express').json({ limit: '10kb' }));
  
  // Data sanitization against NoSQL injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp({
    whitelist: [
      'amount',
      'currency',
      'provider',
      'page',
      'limit',
      'sort'
    ]
  }));

  // Compression middleware
  app.use(require('compression')());
};

module.exports = securityMiddleware;