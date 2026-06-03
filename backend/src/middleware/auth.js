const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const User = require('../models/User');

/**
 * Authenticate user with JWT token
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
async function authMiddleware(req, res, next) {
  try {
    // Get token from header or cookie
    const token =
      req.headers.authorization?.split(' ')[1] ||
      req.cookies?.token ||
      req.headers['x-auth-token'];

    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;

    // Find user
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
}

module.exports = authMiddleware;
