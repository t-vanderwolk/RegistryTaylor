import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const canManagePolls = (role) => role === 'ADMIN' || role === 'MENTOR';

const pollInclude = {
  options: {
    orderBy: { order: 'asc' },
    select: {
      id: true,
      label: true,
      votes: true,
      order: true,
    },
  },
};

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { active } = req.query;
    const where =
      typeof active === 'string'
        ? {
            isActive: active === 'true',
          }
        : undefined;

    const polls = await prisma.poll.findMany({
      where,
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
      include: pollInclude,
    });

    res.json({ polls });
  }),
);

router.get(
  '/:pollId',
  asyncHandler(async (req, res) => {
    const { pollId } = req.params;

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: pollInclude,
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    res.json({ poll });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!canManagePolls(req.user.role)) {
      return res.status(403).json({ message: 'Only mentors or admins may create polls.' });
    }

    const { question, category, closesAt, options = [], isActive = true } = req.body ?? {};

    if (!question || !category) {
      return res.status(400).json({ message: 'Question and category are required.' });
    }

    if (!Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ message: 'At least one poll option is required.' });
    }

    const data = await prisma.poll.create({
      data: {
        question,
        category,
        isActive,
        closesAt: closesAt ? new Date(closesAt) : null,
        options: {
          create: options.map((option, index) => ({
            label: option.label ?? option,
            votes: option.votes ?? 0,
            order: option.order ?? index,
          })),
        },
      },
      include: pollInclude,
    });

    res.status(201).json({ poll: data });
  }),
);

router.post(
  '/:pollId',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!canManagePolls(req.user.role)) {
      return res.status(403).json({ message: 'Only mentors or admins may update polls.' });
    }

    const { pollId } = req.params;
    const { question, category, isActive, closesAt, options } = req.body ?? {};

    const poll = await prisma.poll.update({
      where: { id: pollId },
      data: {
        ...(typeof question === 'string' ? { question } : {}),
        ...(typeof category === 'string' ? { category } : {}),
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
        ...(closesAt !== undefined ? { closesAt: closesAt ? new Date(closesAt) : null } : {}),
      },
      include: pollInclude,
    });

    if (Array.isArray(options)) {
      await Promise.all(
        options.map((option, index) => {
          if (option.id) {
            return prisma.pollOption.update({
              where: { id: option.id },
              data: {
                ...(option.label ? { label: option.label } : {}),
                ...(typeof option.votes === 'number' ? { votes: option.votes } : {}),
                order: option.order ?? index,
              },
            });
          }
          return prisma.pollOption.create({
            data: {
              pollId,
              label: option.label ?? '',
              votes: option.votes ?? 0,
              order: option.order ?? index,
            },
          });
        }),
      );
    }

    const refreshed = await prisma.poll.findUnique({
      where: { id: pollId },
      include: pollInclude,
    });

    res.json({ poll: refreshed });
  }),
);

router.post(
  '/:pollId/vote',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { pollId } = req.params;
    const { optionId } = req.body ?? {};

    if (!optionId) {
      return res.status(400).json({ message: 'optionId is required.' });
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: pollInclude,
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    if (!poll.isActive) {
      return res.status(400).json({ message: 'Poll is closed.' });
    }

    const optionExists = poll.options.some((option) => option.id === optionId);
    if (!optionExists) {
      return res.status(404).json({ message: 'Poll option not found.' });
    }

    const updatedOption = await prisma.pollOption.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } },
    });

    res.json({ option: updatedOption });
  }),
);

export default router;
