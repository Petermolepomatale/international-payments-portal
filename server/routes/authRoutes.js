const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegistration, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);

module.exports = router;