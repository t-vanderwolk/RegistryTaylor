import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import config from '../config.js';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const roleDashboardMap = {
  ADMIN: '/dashboard/admin',
  MENTOR: '/dashboard/mentor',
  MEMBER: '/dashboard/member',
};

const buildToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });

const validRoles = new Set(['ADMIN', 'MENTOR', 'MEMBER']);

const authSelect = {
  id: true,
  email: true,
  role: true,
};

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.env === 'production',
  path: '/',
};

const tokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const resolveRole = (role) => {
  if (!role) return 'MEMBER';
  const normalized = String(role).trim().toUpperCase();
  return validRoles.has(normalized) ? normalized : 'MEMBER';
};

const respondWithUser = async (userId, res) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: authSelect,
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json(user);
};

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        ...authSelect,
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = buildToken(user);
    if (!token) {
      return res.status(500).json({ message: 'Unable to generate session token.' });
    }

    const redirectTo = roleDashboardMap[user.role] || '/dashboard/member';

    res.cookie('token', token, tokenCookieOptions).json({
      token,
      redirectTo,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  }),
);

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = resolveRole(role);

    const createdUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: assignedRole,
      },
      select: authSelect,
    });

    const token = buildToken(createdUser);
    const redirectTo = roleDashboardMap[createdUser.role] || '/dashboard/member';

    res
      .status(201)
      .cookie('token', token, tokenCookieOptions)
      .json({
        token,
        redirectTo,
        user: createdUser,
      });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    await respondWithUser(req.user.id, res);
  }),
);

const extractToken = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  const bearer = req.headers.authorization;
  if (bearer && bearer.startsWith('Bearer ')) {
    return bearer.split(' ')[1];
  }
  return null;
};

router.get(
  '/session',
  asyncHandler(async (req, res) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Missing session token.' });
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret);
      if (!payload?.id) {
        return res.status(401).json({ message: 'Invalid session token.' });
      }
      await respondWithUser(payload.id, res);
    } catch {
      return res.status(401).json({ message: 'Invalid session token.' });
    }
  }),
);

router.delete(
  '/session',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.clearCookie('token', baseCookieOptions);
    res.status(204).json({ message: 'Session cleared' });
  }),
);

router.post(
  '/logout',
  asyncHandler(async (_req, res) => {
    res.clearCookie('token', baseCookieOptions);
    res.status(204).json({ message: 'Logged out' });
  }),
);

export default router;
