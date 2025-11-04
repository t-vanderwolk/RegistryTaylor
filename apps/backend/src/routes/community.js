import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/posts',
  asyncHandler(async (_req, res) => {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
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

    res.json({ posts });
  }),
);

router.post(
  '/posts',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, body, tags = [] } = req.body;

    if (!title || !body) {
      return res
        .status(400)
        .json({ message: 'Title and body are required to create a post.' });
    }

    const post = await prisma.communityPost.create({
      data: {
        authorId: req.user.id,
        title,
        body,
        tags,
      },
    });

    res.status(201).json({ post });
  }),
);

export default router;
