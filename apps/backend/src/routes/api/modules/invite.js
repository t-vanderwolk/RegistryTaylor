const express = require('express');
const { UserRole } = require('@prisma/client');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { generateInviteCode, acceptInvite } = require('../../../services/onboarding');
const { requireMentor, requireAdmin } = require('../../../middleware/auth');

const router = express.Router();

router.post(
  '/create',
  requireMentor,
  asyncHandler(async (req, res) => {
    const { email, role = UserRole.MEMBER, name, message, expiresAt } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: { message: 'Email is required to create an invite' } });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: { message: 'Invalid invite role' } });
    }

    const code = generateInviteCode();
    const invite = await prisma.invite.create({
      data: {
        code,
        email: email.toLowerCase(),
        name,
        role,
        message,
        createdById: req.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return res.status(201).json({ invite });
  })
);

const mapInvite = (invite) => {
  let status = 'PENDING';
  if (invite.acceptedAt) {
    status = 'ACCEPTED';
  } else if (invite.expiresAt && invite.expiresAt < new Date()) {
    status = 'EXPIRED';
  }

  return {
    code: invite.code,
    email: invite.email,
    name: invite.name,
    role: invite.role,
    status,
    createdAt: invite.createdAt,
    createdBy: invite.createdBy,
  };
};

const findInvite = async (code) =>
  prisma.invite.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

router.get(
  '/validate/:code',
  asyncHandler(async (req, res) => {
    const invite = await findInvite(req.params.code);

    if (!invite) {
      return res.status(404).json({ error: { message: 'Invite not found' } });
    }

    return res.json({ invite: mapInvite(invite) });
  })
);

router.get(
  '/verify/:code',
  asyncHandler(async (req, res) => {
    const invite = await findInvite(req.params.code);

    if (!invite) {
      return res.status(404).json({ error: { message: 'Invite not found' } });
    }

    return res.json({ invite: mapInvite(invite) });
  })
);

router.post(
  '/accept',
  asyncHandler(async (req, res) => {
    const { code, password, name } = req.body || {};
    const user = await acceptInvite({ code, password, name });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  })
);

module.exports = router;
