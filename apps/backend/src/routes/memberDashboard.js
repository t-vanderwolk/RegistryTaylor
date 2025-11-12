import express from 'express';

import prisma from '../db/prismaClient.js';
import { requireRole } from '../middleware/auth.js';
import { fetchRegistryData } from '../services/registryService.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const WORKBOOK_ENTRY_SELECT = {
  id: true,
  memberId: true,
  moduleSlug: true,
  content: true,
  shared: true,
  createdAt: true,
  updatedAt: true,
};

router.get(
  '/',
  requireRole('MEMBER'),
  asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [
      user,
      profile,
      modules,
      events,
      communityPosts,
      workbookEntries,
      registryData,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true },
      }),
      prisma.profile.findUnique({
        where: { userId },
        include: {
          mentor: {
            select: { id: true, email: true, role: true },
          },
        },
      }),
      prisma.academyModule.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          summary: true,
          category: true,
          journey: true,
          order: true,
          lecture: true,
          workbookPrompt: true,
          content: true,
          progress: {
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            take: 1,
            select: {
              percent: true,
              completed: true,
              quizScore: true,
              reflection: true,
              updatedAt: true,
            },
          },
        },
      }),
      prisma.event.findMany({
        where: {
          startsAt: {
            gte: new Date(),
          },
        },
        orderBy: { startsAt: 'asc' },
        include: {
          rsvps: {
            select: { id: true, userId: true, status: true },
          },
          createdBy: {
            select: { id: true, email: true },
          },
        },
      }),
      prisma.communityPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { email: true, role: true },
          },
        },
        take: 10,
      }),
      prisma.workbookEntry.findMany({
        where: { memberId: userId },
        orderBy: { updatedAt: 'desc' },
        take: 25,
        select: WORKBOOK_ENTRY_SELECT,
      }),
      fetchRegistryData().catch((error) => {
        logError('member-dashboard: registry load failed', error);
        return { items: [] };
      }),
    ]);

    const academy = buildAcademyPayload(modules);
    const eventsPayload = buildEventsPayload(events, userId);
    const community = buildCommunityPayload(communityPosts);
    const workbook = buildWorkbookPayload(workbookEntries, academy.modules);
    const registry = {
      items: registryData.items,
      goal: Math.max(40, registryData.items.length + 10),
    };

    res.json({
      user: {
        id: user?.id ?? userId,
        email: user?.email ?? '',
        role: user?.role ?? 'MEMBER',
      },
      profile: {
        conciergePriority: profile?.conciergePriority ?? null,
        mentor: profile?.mentor
          ? {
              id: profile.mentor.id,
              email: profile.mentor.email,
            }
          : null,
        notes: profile?.notes ?? null,
      },
      academy,
      events: eventsPayload,
      community,
      workbook,
      registry,
    });
  }),
);

function buildAcademyPayload(modules) {
  const normalized = modules.map((module) => ({
    id: module.id,
    slug: module.slug,
    title: module.title,
    subtitle: module.subtitle,
    summary: module.summary,
    category: module.category,
    journey: module.journey,
    order: module.order,
    lecture: module.lecture,
    workbookPrompt: module.workbookPrompt,
    content: module.content,
    progress: module.progress?.[0]
      ? {
          percent: module.progress[0].percent,
          completed: module.progress[0].completed,
          quizScore: module.progress[0].quizScore,
          reflection: module.progress[0].reflection,
          updatedAt: module.progress[0].updatedAt,
        }
      : null,
  }));

  const totalModules = normalized.length;
  const completedModules = normalized.filter((module) => module.progress?.completed).length;
  const percentComplete = totalModules
    ? Math.round(
        normalized.reduce(
          (acc, module) => acc + (module.progress?.percent ?? 0),
          0,
        ) / totalModules,
      )
    : 0;

  return {
    modules: normalized,
    summary: {
      totalModules,
      completedModules,
      percentComplete,
    },
  };
}

function buildEventsPayload(events, userId) {
  const upcoming = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startsAt: event.startsAt,
    location: event.location,
    createdBy: event.createdBy,
    rsvps: event.rsvps,
  }));

  const bookings = upcoming.filter((event) =>
    event.rsvps?.some((rsvp) => rsvp.userId === userId && rsvp.status === 'GOING'),
  );

  return { upcoming, bookings };
}

function buildCommunityPayload(posts) {
  const highlights = posts.slice(0, 3).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: toExcerpt(post.body),
    author: toDisplayName(post.author?.email),
    createdAt: post.createdAt,
  }));

  return {
    highlights,
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      tags: post.tags,
      createdAt: post.createdAt,
      author: {
        email: post.author?.email ?? '',
        role: post.author?.role ?? 'MEMBER',
      },
    })),
  };
}

function buildWorkbookPayload(entries, modules) {
  const moduleTitleMap = new Map(modules.map((module) => [module.slug, module.title]));

  const normalized = entries.map((entry) => ({
    id: entry.id,
    moduleSlug: entry.moduleSlug,
    moduleTitle: moduleTitleMap.get(entry.moduleSlug) ?? 'Taylor-Made Reflection',
    content: entry.content,
    shared: entry.shared,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }));

  const latest = normalized[0] ?? null;

  return {
    entries: normalized,
    latest,
  };
}

function toDisplayName(email) {
  if (!email) {
    return 'Taylor-Made Mentor';
  }
  const namePart = email.split('@')[0] ?? '';
  if (!namePart) {
    return email;
  }
  return namePart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function toExcerpt(body, max = 160) {
  const trimmed = (body ?? '').trim().replace(/\s+/g, ' ');
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1)}…`;
}

export default router;
