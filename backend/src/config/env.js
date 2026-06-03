require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shortify',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  shortCodeLength: 6,
  maxVisitsStored: 100,
};
