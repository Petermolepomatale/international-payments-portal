const express = require('express');
const { createUser, getAllUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');
const { validateRegistration, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes protected and restricted to employees (admin)
router.use(protect, restrictTo('employee'));

router.post('/users', validateRegistration, handleValidationErrors, createUser);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;