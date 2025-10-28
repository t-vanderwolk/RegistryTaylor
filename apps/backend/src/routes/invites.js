const express = require('express');
const db = require('../db/connection');
const prisma = require('../db/prisma');
const asyncHandler = require('../utils/asyncHandler');

const ADMIN_INVITES_KEY = process.env.ADMIN_INVITES_KEY || 'tmbc-admin-preview';

const router = express.Router();

router.post(
  '/request',
  asyncHandler(async (req, res) => {
    const { name, email, dueDate, message } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: { message: 'Name and email are required' } });
    }

    const payload = {
      name,
      email: email.toLowerCase(),
      due_date: dueDate ? new Date(dueDate) : null,
      message: message || null,
      created_at: new Date(),
    };

    await db('invite_requests').insert(payload);

    return res.status(201).json({
      request: {
        name: payload.name,
        email: payload.email,
        dueDate: payload.due_date,
      },
    });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if ((adminKey || '').toString() !== ADMIN_INVITES_KEY) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const requests = await db('invite_requests')
      .select('id', 'name', 'email', 'due_date as dueDate', 'message', 'created_at as createdAt')
      .orderBy('created_at', 'desc');

    return res.json({ requests });
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
    createdBy: invite.createdBy
      ? {
          id: invite.createdBy.id,
          name: invite.createdBy.name,
          email: invite.createdBy.email,
        }
      : null,
  };
};

router.get(
  '/verify/:code',
  asyncHandler(async (req, res) => {
    const invite = await prisma.invite.findUnique({
      where: { code: req.params.code.toUpperCase() },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!invite) {
      return res.status(404).json({ error: { message: 'Invite not found' } });
    }

    return res.json({ invite: mapInvite(invite) });
  })
);

// Backwards compatibility
router.get(
  '/validate/:code',
  asyncHandler(async (req, res) => {
    const invite = await prisma.invite.findUnique({
      where: { code: req.params.code.toUpperCase() },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!invite) {
      return res.status(404).json({ error: { message: 'Invite not found' } });
    }

    return res.json({ invite: mapInvite(invite) });
  })
);

module.exports = router;
