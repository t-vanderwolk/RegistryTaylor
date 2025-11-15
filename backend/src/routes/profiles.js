import express from 'express';

import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.json({ profile });
  }),
);

router.put(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { conciergePriority, notes, mentorId } = req.body;
    const data = {};

    if (conciergePriority !== undefined) {
      data.conciergePriority = conciergePriority;
    }

    if (notes !== undefined) {
      data.notes = String(notes);
    }

    if (mentorId) {
      const mentor = await prisma.user.findUnique({
        where: { id: mentorId },
      });

      if (!mentor || mentor.role !== 'MENTOR') {
        return res.status(400).json({ message: 'Mentor not found.' });
      }

      data.mentorId = mentorId;
    } else if (mentorId === null) {
      data.mentorId = null;
    }

    const profile = await prisma.profile.upsert({
      where: { userId: req.user.id },
      update: data,
      create: {
        userId: req.user.id,
        conciergePriority: data.conciergePriority ?? 3,
        notes: data.notes,
        mentorId: data.mentorId,
      },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    res.json({ profile });
  }),
);

router.get(
  '/mentors',
  asyncHandler(async (_req, res) => {
    const mentors = await prisma.user.findMany({
      where: { role: 'MENTOR' },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
      },
      orderBy: { email: 'asc' },
    });

    res.json({ mentors });
  }),
);

export default router;
