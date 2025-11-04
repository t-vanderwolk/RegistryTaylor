import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const canModerate = (role) => role === 'ADMIN' || role === 'MENTOR';

router.get(
  '/:postId',
  asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
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

    res.json({ comments });
  }),
);

router.post(
  '/:postId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { body } = req.body ?? {};

    if (!body) {
      return res.status(400).json({ message: 'Comment body is required.' });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Community post not found.' });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: req.user.id,
        body,
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

    res.status(201).json({ comment });
  }),
);

router.post(
  '/:commentId/update',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { body } = req.body ?? {};

    if (!body) {
      return res.status(400).json({ message: 'Comment body is required.' });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.authorId !== req.user.id && !canModerate(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to update this comment.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { body },
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

    res.json({ comment: updatedComment });
  }),
);

export default router;
