import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const RSVP_STATUSES = ['GOING', 'INTERESTED', 'DECLINED'];

router.get(
  '/upcoming',
  asyncHandler(async (_req, res) => {
    const events = await prisma.event.findMany({
      where: {
        startsAt: {
          gte: new Date(),
        },
      },
      orderBy: { startsAt: 'asc' },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
        rsvps: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    res.json({ events });
  }),
);

router.post(
  '/rsvp',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { eventId, status = 'GOING' } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required.' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const normalizedStatus = RSVP_STATUSES.includes(status)
      ? status
      : 'GOING';

    const rsvp = await prisma.eventRsvp.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: req.user.id,
        },
      },
      update: {
        status: normalizedStatus,
      },
      create: {
        eventId,
        userId: req.user.id,
        status: normalizedStatus,
      },
    });

    res.status(201).json({ rsvp });
  }),
);

export default router;
