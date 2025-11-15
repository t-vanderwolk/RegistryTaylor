import express from 'express';

import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const resolveModuleWhere = (moduleId, moduleSlug) => {
  if (moduleId) {
    return { id: String(moduleId) };
  }

  if (moduleSlug) {
    return { slug: String(moduleSlug) };
  }

  return null;
};

const moduleSelection = (userId) => ({
  id: true,
  slug: true,
  title: true,
  summary: true,
  category: true,
  lecture: true,
  workbookPrompt: true,
  order: true,
  content: true,
  progress: {
    where: userId ? { userId } : undefined,
    orderBy: { updatedAt: 'desc' },
    select: {
      percent: true,
      completed: true,
      quizScore: true,
      reflection: true,
      updatedAt: true,
    },
    take: userId ? 1 : 0,
  },
});

router.get(
  '/modules',
  requireAuth,
  asyncHandler(async (req, res) => {
    const modules = await prisma.academyModule.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: moduleSelection(req.user.id),
    });

    res.json({ modules });
  }),
);

router.get(
  '/modules/:slug',
  requireAuth,
  asyncHandler(async (req, res) => {
    const module = await prisma.academyModule.findFirst({
      where: { slug: req.params.slug },
      select: moduleSelection(req.user.id),
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    res.json({ module });
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

router.get(
  '/quiz',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { moduleId, moduleSlug } = req.query;
    const where = resolveModuleWhere(moduleId, moduleSlug);

    if (!where) {
      return res.status(400).json({ message: 'moduleId or moduleSlug is required.' });
    }

    const module = await prisma.academyModule.findFirst({
      where,
      select: {
        id: true,
        quizzes: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
          },
        },
      },
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    res.json({
      moduleId: module.id,
      questions: module.quizzes,
    });
  }),
);

router.post(
  '/quiz',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { moduleId, moduleSlug, responses } = req.body ?? {};
    const where = resolveModuleWhere(moduleId, moduleSlug);

    if (!where) {
      return res.status(400).json({ message: 'moduleId or moduleSlug is required.' });
    }

    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({ message: 'Quiz responses are required.' });
    }

    const module = await prisma.academyModule.findFirst({
      where,
      select: {
        id: true,
        quizzes: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            answer: true,
            question: true,
          },
        },
      },
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    const quizzes = module.quizzes;

    if (!quizzes.length) {
      return res.status(400).json({ message: 'No quiz available for this module.' });
    }

    let correctCount = 0;

    for (const quiz of quizzes) {
      const response = String(responses[quiz.id] ?? '').trim();
      if (response && response.toLowerCase() === quiz.answer.toLowerCase()) {
        correctCount += 1;
      }
    }

    const totalQuestions = quizzes.length;
    const computedPercent =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const existingProgress = await prisma.academyProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: req.user.id,
          moduleId: module.id,
        },
      },
    });

    const nextPercent = Math.max(existingProgress?.percent ?? 0, computedPercent);
    const completed = existingProgress?.completed || nextPercent >= 100;

    const progress = await prisma.academyProgress.upsert({
      where: {
        userId_moduleId: {
          userId: req.user.id,
          moduleId: module.id,
        },
      },
      update: {
        percent: nextPercent,
        completed,
        quizScore: correctCount,
      },
      create: {
        userId: req.user.id,
        moduleId: module.id,
        percent: nextPercent,
        completed,
        quizScore: correctCount,
      },
    });

    res.json({
      score: correctCount,
      total: totalQuestions,
      progress,
    });
  }),
);

router.get(
  '/reflection',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { moduleId, moduleSlug } = req.query;
    const where = resolveModuleWhere(moduleId, moduleSlug);

    if (!where) {
      return res.status(400).json({ message: 'moduleId or moduleSlug is required.' });
    }

    const module = await prisma.academyModule.findFirst({
      where,
      select: { id: true },
    });

    if (!module) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    const progress = await prisma.academyProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: req.user.id,
          moduleId: module.id,
        },
      },
      select: {
        reflection: true,
        percent: true,
        completed: true,
        quizScore: true,
      },
    });

    res.json({
      reflection: progress?.reflection ?? null,
      quizScore: progress?.quizScore ?? null,
      percent: progress?.percent ?? 0,
      completed: progress?.completed ?? false,
    });
  }),
);

router.post(
  '/reflection',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { moduleId, moduleSlug, reflection } = req.body ?? {};
    const where = resolveModuleWhere(moduleId, moduleSlug);

    if (!where) {
      return res.status(400).json({ message: 'moduleId or moduleSlug is required.' });
    }

    if (typeof reflection !== 'string') {
      return res.status(400).json({ message: 'Reflection text is required.' });
    }

    const module = await prisma.academyModule.findFirst({
      where,
      select: { id: true },
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
        reflection,
      },
      create: {
        userId: req.user.id,
        moduleId: module.id,
        reflection,
      },
    });

    res.json({ reflection: progress.reflection ?? null });
  }),
);

export default router;
