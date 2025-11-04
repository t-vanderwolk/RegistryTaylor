import jwt from 'jsonwebtoken';
import config from '../config.js';

const getTokenFromRequest = (req) => {
  const bearer = req.headers.authorization;
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  if (bearer && bearer.startsWith('Bearer ')) {
    return bearer.split(' ')[1];
  }

  return null;
};

export function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

export default requireAuth;
