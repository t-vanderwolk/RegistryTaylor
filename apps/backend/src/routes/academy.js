import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/modules',
  requireAuth,
  asyncHandler(async (req, res) => {
    const modules = await prisma.academyModule.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        progress: {
          where: { userId: req.user.id },
          select: { percent: true },
        },
      },
    });

    const formatted = modules.map((module) => ({
      id: module.id,
      title: module.title,
      slug: module.slug,
      summary: module.summary,
      content: module.content,
      progress: module.progress[0]?.percent ?? 0,
    }));

    res.json({ modules: formatted });
  }),
);

router.post(
  '/progress',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { moduleId, moduleSlug, percent } = req.body;

    if (
      (moduleId === undefined && moduleSlug === undefined) ||
      percent === undefined
    ) {
      return res.status(400).json({
        message: 'moduleId or moduleSlug and percent are required.',
      });
    }

    const clampedPercent = Math.max(0, Math.min(Number(percent), 100));

    const module = await prisma.academyModule.findFirst({
      where: moduleId
        ? { id: moduleId }
        : {
            slug: moduleSlug,
          },
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    const progress = await prisma.academyProgress.upsert({
      where: {
        userId_moduleId: {
          userId: req.user.id,
          moduleId: module.id,
        },
      },
      update: {
        percent: clampedPercent,
      },
      create: {
        userId: req.user.id,
        moduleId: module.id,
        percent: clampedPercent,
      },
    });

    res.json({ progress });
  }),
);

export default router;
