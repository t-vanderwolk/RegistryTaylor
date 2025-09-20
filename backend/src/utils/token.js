const jwt = require('jsonwebtoken');

const getSecret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
    if (process.env.NODE_ENV !== 'production') {
      // Fallback for local development to avoid hard failures when .env missing.
      process.env.JWT_SECRET = 'development-default-secret';
    } else {
      throw new Error('JWT_SECRET not configured');
    }
  }
  return process.env.JWT_SECRET;
};

const signToken = (payload, options = {}) =>
  jwt.sign(payload, getSecret(), { expiresIn: '8h', ...options });

const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = {
  signToken,
  verifyToken,
};
