const express = require('express');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { requireUser, requireMember } = require('../../../middleware/auth');

const router = express.Router();

router.get(
  '/modules',
  requireUser,
  asyncHandler(async (_req, res) => {
    const modules = await prisma.academyModule.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ modules });
  })
);

router.get(
  '/modules/:slug',
  requireUser,
  asyncHandler(async (req, res) => {
    const moduleEntry = await prisma.academyModule.findUnique({
      where: { slug: req.params.slug },
    });

    if (!moduleEntry) {
      return res.status(404).json({ error: { message: 'Module not found' } });
    }

    return res.json({ module: moduleEntry });
  })
);

router.post(
  '/progress',
  requireMember,
  asyncHandler(async (req, res) => {
    const { slug, completed = false, percent = 0 } = req.body || {};
    if (!slug) {
      return res.status(400).json({ error: { message: 'Module slug is required' } });
    }

    const moduleEntry = await prisma.academyModule.findUnique({ where: { slug } });
    if (!moduleEntry) {
      return res.status(404).json({ error: { message: 'Module not found' } });
    }

    const normalizedPercent = Math.max(0, Math.min(100, Number(percent) || 0));

    const progress = await prisma.academyProgress.upsert({
      where: {
        userId_moduleId: {
          userId: req.user.id,
          moduleId: moduleEntry.id,
        },
      },
      update: {
        percent: normalizedPercent,
        completed: Boolean(completed) || normalizedPercent === 100,
        completedAt: completed || normalizedPercent === 100 ? new Date() : null,
      },
      create: {
        userId: req.user.id,
        moduleId: moduleEntry.id,
        percent: normalizedPercent,
        completed: Boolean(completed) || normalizedPercent === 100,
        completedAt: completed || normalizedPercent === 100 ? new Date() : null,
      },
    });

    return res.status(201).json({ progress });
  })
);

router.get(
  '/progress/me',
  requireMember,
  asyncHandler(async (req, res) => {
    const progress = await prisma.academyProgress.findMany({
      where: { userId: req.user.id },
      include: {
        module: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({ progress });
  })
);

module.exports = router;
