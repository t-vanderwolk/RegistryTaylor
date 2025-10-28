const express = require('express');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { requireUser, requireMentor } = require('../../../middleware/auth');

const router = express.Router();

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

router.get(
  '/posts',
  requireUser,
  asyncHandler(async (_req, res) => {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
    return res.json({ posts });
  })
);

router.post(
  '/posts',
  requireMentor,
  asyncHandler(async (req, res) => {
    const { title, body, tags, isAnnouncement = false } = req.body || {};

    if (!title || !body) {
      return res.status(400).json({ error: { message: 'Title and body are required' } });
    }

    const post = await prisma.communityPost.create({
      data: {
        title,
        body,
        tags: normalizeTags(tags),
        isAnnouncement: Boolean(isAnnouncement),
        authorId: req.user.id,
      },
    });

    return res.status(201).json({ post });
  })
);

router.get(
  '/events',
  requireUser,
  asyncHandler(async (_req, res) => {
    const events = await prisma.event.findMany({
      orderBy: { startsAt: 'asc' },
    });
    return res.json({ events });
  })
);

router.post(
  '/events',
  requireMentor,
  asyncHandler(async (req, res) => {
    const { title, description, startsAt, endsAt, location } = req.body || {};

    if (!title || !startsAt) {
      return res.status(400).json({ error: { message: 'Title and startsAt are required' } });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        location: location || null,
        createdById: req.user.id,
      },
    });

    return res.status(201).json({ event });
  })
);

router.get(
  '/announcements',
  requireUser,
  asyncHandler(async (_req, res) => {
    const announcements = await prisma.communityPost.findMany({
      where: { isAnnouncement: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
      },
    });
    return res.json({ announcements });
  })
);

module.exports = router;
