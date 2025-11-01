const express = require('express');
const bcrypt = require('bcryptjs');
const { UserRole } = require('@prisma/client');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { signToken } = require('../../../utils/token');
const { acceptInvite } = require('../../../services/onboarding');
const { requireUser } = require('../../../middleware/auth');

const router = express.Router();

const SESSION_COOKIE_KEY = 'tmbc.session';
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 8; // 8 hours

function setSessionCookie(res, token, user) {
  const payload = {
    token,
    user,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');

  res.cookie(SESSION_COOKIE_KEY, encoded, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
  });
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    profile: user.profile ?? null,
  };
}

function createTokenPayload(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required' } });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const token = signToken(createTokenPayload(user));
    const safeUser = sanitizeUser(user);
    setSessionCookie(res, token, safeUser);
    return res.json({ token, user: safeUser });
  })
);

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: { message: 'Email and password are required' } });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: { message: 'User already exists' } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        role: Object.values(UserRole).includes(role) ? role : UserRole.MEMBER,
        passwordHash,
      },
    });

    const token = signToken(createTokenPayload(user));
    const safeUser = sanitizeUser(user);
    setSessionCookie(res, token, safeUser);
    return res.status(201).json({ token, user: safeUser });
  })
);

router.post(
  '/invite/accept',
  asyncHandler(async (req, res) => {
    const { code, password, name } = req.body || {};
    const user = await acceptInvite({ code, password, name });
    const token = signToken(createTokenPayload(user));
    const hydrated = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    });
    const safeUser = sanitizeUser(hydrated);
    setSessionCookie(res, token, safeUser);
    return res.status(201).json({ token, user: safeUser });
  })
);

router.get(
  '/me',
  requireUser,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        questionnaire: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    return res.json({
      user: sanitizeUser(user),
      questionnaire: user.questionnaire ?? null,
    });
  })
);

module.exports = router;
