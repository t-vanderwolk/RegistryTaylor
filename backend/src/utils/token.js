const jwt = require('jsonwebtoken');

const ONE_DAY = 60 * 60 * 24;

exports.issueToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: ONE_DAY, ...options });
};
