import jwt from 'jsonwebtoken';

import config from '../config.js';

const TOKEN_TTL = '7d';

export function signAuthToken(payload) {
  if (!payload?.id || !payload?.role) {
    throw new Error('Invalid payload for auth token');
  }

  const tokenPayload = {
    id: payload.id,
    role: payload.role,
  };

  if (payload.email) {
    tokenPayload.email = payload.email;
  }

  return jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: TOKEN_TTL });
}

export function verifyAuthToken(token) {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (!decoded || typeof decoded !== 'object' || !decoded.id || !decoded.role) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export default {
  signAuthToken,
  verifyAuthToken,
};
