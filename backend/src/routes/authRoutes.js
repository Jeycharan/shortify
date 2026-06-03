const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { validate, registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validate');

// POST /api/auth/register - Register new user
router.post('/register', validate(registerValidation), handleValidationErrors, register);

// POST /api/auth/login - Login user
router.post('/login', validate(loginValidation), handleValidationErrors, login);

// POST /api/auth/logout - Logout user (protected)
router.post('/logout', authMiddleware, logout);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
