const express = require('express');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { requireUser } = require('../../../middleware/auth');

const router = express.Router();

function buildProfilePayload(body, userId) {
  const { preferredName, pronouns, timezone, mentorId, conciergePriority, mentorNotes, avatarUrl } = body || {};
  return {
    userId,
    preferredName: preferredName || null,
    pronouns: pronouns || null,
    timezone: timezone || null,
    mentorNotes: mentorNotes || null,
    conciergePriority: conciergePriority || null,
    avatarUrl: avatarUrl || null,
    mentorId: mentorId || null,
  };
}

router.post(
  '/create',
  requireUser,
  asyncHandler(async (req, res) => {
    const existing = await prisma.profile.findUnique({ where: { userId: req.user.id } });
    if (existing) {
      return res.status(409).json({ error: { message: 'Profile already exists. Use update instead.' } });
    }

    const profile = await prisma.profile.create({
      data: buildProfilePayload(req.body, req.user.id),
    });

    return res.status(201).json({ profile });
  })
);

router.put(
  '/update',
  requireUser,
  asyncHandler(async (req, res) => {
    const existing = await prisma.profile.findUnique({ where: { userId: req.user.id } });
    if (!existing) {
      return res.status(404).json({ error: { message: 'Profile not found' } });
    }

    const profile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: buildProfilePayload(req.body, req.user.id),
    });

    return res.json({ profile });
  })
);

router.get(
  '/me',
  requireUser,
  asyncHandler(async (req, res) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ error: { message: 'Profile not found' } });
    }

    return res.json({ profile });
  })
);

module.exports = router;
