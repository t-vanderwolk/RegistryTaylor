import express from 'express';

import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/boards', requireAuth, async (req, res, next) => {
  try {
    const boards = await prisma.pinterestBoard.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(boards);
  } catch (error) {
    next(error);
  }
});

router.post('/boards', requireAuth, async (req, res, next) => {
  try {
    const { title, visibility = 'private', pinterestUrl = null } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const board = await prisma.pinterestBoard.create({
      data: {
        title,
        visibility,
        pinterestUrl,
        userId: req.user.id,
      },
    });

    res.status(201).json(board);
  } catch (error) {
    next(error);
  }
});

router.post('/save', requireAuth, async (_req, res) => {
  // TODO: Implement Pinterest API POST /pins call with OAuth token
  res.json({ message: 'Pin saved placeholder' });
});

export default router;
