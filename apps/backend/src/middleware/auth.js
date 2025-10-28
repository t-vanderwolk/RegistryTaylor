const { UserRole } = require('@prisma/client');
const prisma = require('../db/prisma');
const { verifyToken } = require('../utils/token');

const AUTH_HEADER = 'authorization';
const SESSION_COOKIE = 'tmbc.session';

function parseCookies(headerValue) {
  return headerValue.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('=') || '');
    return acc;
  }, {});
}

function extractToken(req) {
  const authHeader = req.headers[AUTH_HEADER];
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  if (req.headers.cookie) {
    const parsed = parseCookies(req.headers.cookie);
    if (parsed?.token) {
      return parsed.token;
    }
    if (parsed?.[SESSION_COOKIE]) {
      try {
        const session = JSON.parse(Buffer.from(parsed[SESSION_COOKIE], 'base64').toString('utf-8'));
        return session?.token ?? null;
      } catch {
        return null;
      }
    }
  }

  return null;
}

async function authenticate(req) {
  const token = extractToken(req);

  if (!token) {
    const error = new Error('Authentication required');
    error.statusCode = 401;
    throw error;
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (error) {
    const err = new Error('Invalid or expired token');
    err.statusCode = 401;
    throw err;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: {
      profile: true,
    },
  });

  if (!user) {
    const error = new Error('User no longer exists');
    error.statusCode = 401;
    throw error;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    profile: user.profile,
  };
}

function respondWithError(res, error) {
  const status = error?.statusCode || 500;
  const message = error?.message || 'Unexpected error';
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  return res.status(status).json({ error: { message } });
}

function requireUser(req, res, next) {
  authenticate(req)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => respondWithError(res, error));
}

function createRoleGuard(roles) {
  return (req, res, next) => {
    authenticate(req)
      .then((user) => {
        if (!roles.includes(user.role)) {
          return res.status(403).json({
            error: { message: 'Access denied for your role' },
          });
        }
        req.user = user;
        return next();
      })
      .catch((error) => respondWithError(res, error));
  };
}

const requireMember = createRoleGuard([UserRole.MEMBER]);
const requireMentor = createRoleGuard([UserRole.MENTOR, UserRole.ADMIN]);
const requireAdmin = createRoleGuard([UserRole.ADMIN]);

function optionalUser(req, _res, next) {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  authenticate(req)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(() => next());
}

module.exports = {
  requireUser,
  requireMember,
  requireMentor,
  requireAdmin,
  optionalUser,
};
