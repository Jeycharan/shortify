const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      user: user.toSafeObject(),
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    // Send response
    res.json({
      message: 'Login successful',
      user: user.toSafeObject(),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}

/**
 * Get current user
 * GET /api/auth/me
 */
async function getCurrentUser(req, res) {
  try {
    res.json({
      message: 'User retrieved successfully',
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
async function logout(req, res) {
  try {
    // Token is invalidated on the client side
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
};
