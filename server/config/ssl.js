const fs = require('fs');
const path = require('path');
const { NODE_ENV } = require('./env');

// SSL Configuration for HTTPS
const getSSLOptions = () => {
  if (NODE_ENV === 'production') {
    // In production, use proper SSL certificates
    try {
      return {
        key: fs.readFileSync(path.join(__dirname, '../ssl/private-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../ssl/certificate.pem')),
        // Add intermediate certificates if needed
        // ca: fs.readFileSync(path.join(__dirname, '../ssl/ca-bundle.pem'))
      };
    } catch (error) {
      console.warn('SSL certificates not found. Using HTTP in production is not recommended.');
      return null;
    }
  } else {
    // In development, create self-signed certificates for testing
    try {
      return {
        key: fs.readFileSync(path.join(__dirname, '../ssl/dev-private-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../ssl/dev-certificate.pem'))
      };
    } catch (error) {
      console.log('Development SSL certificates not found. Run: npm run generate-ssl');
      return null;
    }
  }
};

// Force HTTPS middleware
const forceHTTPS = (req, res, next) => {
  if (NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
};

// Security headers for HTTPS
const httpsSecurityHeaders = (req, res, next) => {
  // Strict Transport Security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Upgrade insecure requests
  res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');
  
  next();
};

module.exports = {
  getSSLOptions,
  forceHTTPS,
  httpsSecurityHeaders
};