const express = require('express');
const { UserRole } = require('@prisma/client');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { requireAdmin } = require('../../../middleware/auth');

const router = express.Router();

router.get(
  '/overview',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [userCounts, registryEntries, registryItems, eventsCount, postsCount] = await Promise.all([
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      prisma.registryEntry.count(),
      prisma.registryItem.count(),
      prisma.event.count(),
      prisma.communityPost.count(),
    ]);

    const overview = {
      members: userCounts.find((item) => item.role === UserRole.MEMBER)?._count.role ?? 0,
      mentors: userCounts.find((item) => item.role === UserRole.MENTOR)?._count.role ?? 0,
      admins: userCounts.find((item) => item.role === UserRole.ADMIN)?._count.role ?? 0,
      registryEntries,
      registryItems,
      events: eventsCount,
      communityPosts: postsCount,
    };

    return res.json({ overview });
  })
);

router.get(
  '/mentors',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const mentors = await prisma.user.findMany({
      where: { role: UserRole.MENTOR },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    const mentorIds = mentors.map((mentor) => mentor.id);
    const menteeCounts = await prisma.profile.groupBy({
      by: ['mentorId'],
      where: { mentorId: { in: mentorIds } },
      _count: { mentorId: true },
    });

    const data = mentors.map((mentor) => ({
      ...mentor,
      mentees: menteeCounts.find((entry) => entry.mentorId === mentor.id)?._count.mentorId ?? 0,
    }));

    return res.json({ mentors: data });
  })
);

router.get(
  '/members',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const members = await prisma.user.findMany({
      where: { role: UserRole.MEMBER },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            preferredName: true,
            conciergePriority: true,
            mentorId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ members });
  })
);

router.get(
  '/registry-summary',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const entriesByCategory = await prisma.registryEntry.groupBy({
      by: ['retailer'],
      _count: { retailer: true },
    });

    const macroBabySessions = await prisma.registryEntry.count({
      where: {
        url: {
          contains: 'macrobaby.com',
          mode: 'insensitive',
        },
      },
    });

    const totals = await prisma.registryEntry.count();

    return res.json({
      summary: {
        totalEntries: totals,
        macroBabyTracked: macroBabySessions,
        retailerBreakdown: entriesByCategory.map((entry) => ({
          retailer: entry.retailer || 'Other',
          count: entry._count.retailer,
        })),
      },
    });
  })
);

module.exports = router;
