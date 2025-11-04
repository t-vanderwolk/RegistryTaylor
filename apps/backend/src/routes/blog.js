import express from 'express';
import prisma from '../db/prismaClient.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    res.json({ posts });
  }),
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    });

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    res.json({ post });
  }),
);

export default router;
