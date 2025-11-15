import express from 'express';

import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const workbookSelect = {
  id: true,
  memberId: true,
  moduleSlug: true,
  content: true,
  shared: true,
  createdAt: true,
  updatedAt: true,
};

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = Number.parseInt(req.query.limit ?? '', 10);
    const size = Number.isNaN(limit) ? 10 : Math.min(limit, 50);

    const entries = await prisma.workbookEntry.findMany({
      where: { memberId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      take: size,
      select: workbookSelect,
    });

    res.json({ entries });
  }),
);

router.get(
  '/entry/:moduleSlug',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { moduleSlug } = req.params;

    if (!moduleSlug) {
      return res.status(400).json({ message: 'moduleSlug is required.' });
    }

    const entry = await prisma.workbookEntry.findUnique({
      where: {
        memberId_moduleSlug: {
          memberId: req.user.id,
          moduleSlug,
        },
      },
      select: workbookSelect,
    });

    res.json({ entry });
  }),
);

router.put(
  '/entry/:moduleSlug',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { moduleSlug } = req.params;
    const { content, shared } = req.body ?? {};

    if (!moduleSlug) {
      return res.status(400).json({ message: 'moduleSlug is required.' });
    }

    const entry = await prisma.workbookEntry.upsert({
      where: {
        memberId_moduleSlug: {
          memberId: req.user.id,
          moduleSlug,
        },
      },
      create: {
        memberId: req.user.id,
        moduleSlug,
        content: content ?? {},
        shared: typeof shared === 'boolean' ? shared : false,
      },
      update: {
        content: content ?? {},
        ...(typeof shared === 'boolean' ? { shared } : {}),
      },
      select: workbookSelect,
    });

    res.json({ entry });
  }),
);

router.get(
  '/:memberId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({ message: 'memberId is required.' });
    }

    const isSelf = req.user.id === memberId;
    const isElevated = req.user.role === 'MENTOR' || req.user.role === 'ADMIN';

    if (!isSelf && !isElevated) {
      return res.status(403).json({ message: 'You are not allowed to view this workbook.' });
    }

    const entries = await prisma.workbookEntry.findMany({
      where: {
        memberId,
        ...(isSelf || req.user.role === 'ADMIN' ? {} : { shared: true }),
      },
      orderBy: { updatedAt: 'desc' },
      select: workbookSelect,
    });

    res.json({ entries });
  }),
);

export default router;
