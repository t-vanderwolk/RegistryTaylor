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
    const payload = jwt.verify(token, config.jwtSecret);

    if (!payload?.id || !payload?.role) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch {
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

export const authenticateToken = requireAuth;
export default requireAuth;
