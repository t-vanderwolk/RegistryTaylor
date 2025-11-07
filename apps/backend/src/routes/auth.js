import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prismaClient.js';
import config from '../config.js';
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

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        role: true,
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

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.env === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const redirectTo = roleDashboardMap[user.role] || '/dashboard/member';

    res.cookie('token', token, cookieOptions).json({
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

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }),
);

export default router;
