import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId: otherUserId } = req.params;
    const userId = req.user.id;

    if (!otherUserId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ messages });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { receiverId, content } = req.body ?? {};

    if (!receiverId || typeof receiverId !== 'string') {
      return res.status(400).json({ message: 'receiverId is required.' });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    const receiverExists = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content: content.trim(),
      },
    });

    res.status(201).json({ message });
  }),
);

export default router;
