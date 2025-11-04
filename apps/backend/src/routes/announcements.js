import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const canManageAnnouncements = (role) => role === 'ADMIN' || role === 'MENTOR';

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Number.parseInt(req.query.limit ?? '', 10);
    const size = Number.isNaN(limit) ? 20 : Math.min(limit, 50);

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: size,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json({ announcements });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!canManageAnnouncements(req.user.role)) {
      return res.status(403).json({ message: 'Only mentors or admins may create announcements.' });
    }

    const { title, body } = req.body ?? {};

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        body,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({ announcement });
  }),
);

router.post(
  '/:announcementId',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!canManageAnnouncements(req.user.role)) {
      return res.status(403).json({ message: 'Only mentors or admins may update announcements.' });
    }

    const { announcementId } = req.params;
    const { title, body } = req.body ?? {};

    const announcement = await prisma.announcement.update({
      where: { id: announcementId },
      data: {
        ...(title ? { title } : {}),
        ...(body ? { body } : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json({ announcement });
  }),
);

export default router;
