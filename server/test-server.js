const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'International Payments Portal API is running',
    timestamp: new Date().toISOString(),
    environment: 'test'
  });
});

// Mock auth routes for testing
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Mock authentication
  if (username === 'admin' && password === 'Admin123!') {
    res.json({
      status: 'success',
      token: 'mock-jwt-token',
      data: {
        user: {
          _id: '1',
          fullName: 'Admin User',
          username: 'admin',
          role: 'employee',
          isActive: true
        }
      }
    });
  } else if (username === 'johnsmith' && password === 'Password123!') {
    res.json({
      status: 'success',
      token: 'mock-jwt-token',
      data: {
        user: {
          _id: '2',
          fullName: 'John Smith',
          username: 'johnsmith',
          role: 'customer',
          isActive: true
        }
      }
    });
  } else {
    res.status(401).json({
      status: 'fail',
      message: 'Incorrect username or password'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: {
        _id: '1',
        fullName: 'Test User',
        username: 'testuser',
        role: 'customer',
        isActive: true
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log('This is a test server without MongoDB dependency');
  console.log('For full functionality, set up MongoDB and use npm run dev');
});

module.exports = app;