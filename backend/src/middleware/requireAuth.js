const db = require('../db/connection');
const { verifyToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: { message: 'Authentication required' } });
    }

    const payload = verifyToken(token);
    const user = await db('users').where({ id: payload.sub }).first();

    if (!user || !user.active) {
      return res.status(401).json({ error: { message: 'Account inactive or not found' } });
    }

    req.user = user;
    next();
  } catch (error) {
    next({ status: 401, message: 'Invalid or expired token' });
  }
};
