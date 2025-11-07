import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const includeMentorNotes = {
  mentorNotes: {
    include: {
      mentor: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  },
};

const allowedSources = new Set([
  'macro',
  'silvercross',
  'awin',
  'cj',
  'myregistry',
  'babylist',
  'impact',
  'static',
]);

const normalizeSource = (value) => {
  if (typeof value !== 'string') {
    return 'static';
  }
  const normalized = value.toLowerCase();
  return allowedSources.has(normalized) ? normalized : 'static';
};

const parsePrice = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const numeric = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
};

const canActForOtherUser = (req, targetUserId) =>
  targetUserId === req.user.id || req.user.role === 'ADMIN' || req.user.role === 'MENTOR';

const resolveTargetUserId = (req, possibleId) => {
  const target = String(possibleId ?? req.user.id);
  if (!canActForOtherUser(req, target)) {
    return null;
  }
  return target;
};

router.get(
  '/catalog',
  asyncHandler(async (_req, res) => {
    const items = await prisma.registryCatalogItem.findMany({
      orderBy: [{ source: 'asc' }, { title: 'asc' }],
    });

    res.json({ items });
  }),
);

router.get(
  '/catalog/:id',
  asyncHandler(async (req, res) => {
    const item = await prisma.registryCatalogItem.findUnique({
      where: { id: req.params.id },
    });

    if (!item) {
      return res.status(404).json({ message: 'Catalog item not found.' });
    }

    res.json({ item });
  }),
);

router.get(
  '/entry',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = resolveTargetUserId(req, req.query.userId);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const items = await prisma.registryItem.findMany({
      where: { userId },
      include: includeMentorNotes,
      orderBy: [{ createdAt: 'desc' }],
    });

    res.json({ items });
  }),
);

router.post(
  '/entry',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId: overrideUserId, itemId, item, notes } = req.body ?? {};
    const userId = resolveTargetUserId(req, overrideUserId);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (itemId && !item) {
      const existing = await prisma.registryItem.findFirst({
        where: { id: itemId, userId },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Registry item not found.' });
      }

      const updated = await prisma.registryItem.update({
        where: { id: existing.id },
        data: {
          notes: typeof notes === 'string' ? notes : existing.notes,
        },
        include: includeMentorNotes,
      });

      return res.status(200).json({ item: updated });
    }

    if (!item || !item.name) {
      return res.status(400).json({ message: 'Item details are required.' });
    }

    const externalId =
      (item.externalId || item.affiliateId || item.name || `manual-${Date.now()}`)
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `manual-${Date.now()}`;

    const payload = {
      name: item.name,
      brand: item.brand ?? null,
      category: item.category ?? null,
      price: parsePrice(item.price),
      url: item.url ?? null,
      retailer: item.retailer ?? null,
      notes: typeof notes === 'string' ? notes : item.notes ?? null,
      source: normalizeSource(item.source),
      affiliateUrl: item.affiliateUrl ?? item.url ?? null,
      affiliateId: item.affiliateId ?? externalId,
      importedFrom: item.importedFrom ?? item.url ?? null,
      imageUrl: item.imageUrl ?? null,
    };

    const created = await prisma.registryItem.upsert({
      where: {
        externalId_userId: {
          externalId,
          userId,
        },
      },
      update: payload,
      create: {
        ...payload,
        userId,
        externalId,
      },
      include: includeMentorNotes,
    });

    res.status(201).json({ item: created });
  }),
);

router.post(
  '/entry/bulk',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { items, userId: overrideUserId } = req.body ?? {};
    const userId = resolveTargetUserId(req, overrideUserId);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Registry items are required.' });
    }

    const operations = items.map((entry) => {
      if (!entry || !entry.name) {
        return null;
      }
      const externalId =
        (entry.externalId || entry.affiliateId || entry.id || entry.name || `manual-${Date.now()}`)
          .toString()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `manual-${Date.now()}`;
      const payload = {
        name: entry.name,
        brand: entry.brand ?? null,
        category: entry.category ?? null,
        price: parsePrice(entry.price),
        url: entry.url ?? null,
        retailer: entry.retailer ?? null,
        notes: entry.description ?? null,
        source: normalizeSource(entry.registrySource ?? entry.source),
        affiliateUrl: entry.affiliateUrl ?? entry.url ?? null,
        affiliateId: entry.affiliateId ?? externalId,
        importedFrom: entry.importedFrom ?? entry.url ?? null,
        imageUrl: entry.image ?? entry.imageUrl ?? null,
      };

      return prisma.registryItem.upsert({
        where: {
          externalId_userId: {
            externalId,
            userId,
          },
        },
        update: payload,
        create: {
          ...payload,
          userId,
          externalId,
        },
      });
    });

    const filteredOps = operations.filter(Boolean);
    if (!filteredOps.length) {
      return res.status(400).json({ message: 'No valid registry items supplied.' });
    }

    await prisma.$transaction(filteredOps);
    const records = await prisma.registryItem.findMany({
      where: { userId },
      include: includeMentorNotes,
      orderBy: [{ createdAt: 'desc' }],
    });

    res.json({ items: records });
  }),
);

router.put(
  '/entry/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = resolveTargetUserId(req, req.body?.userId);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const existing = await prisma.registryItem.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Registry item not found.' });
    }

    const payload = {};
    const { name, brand, category, price, url, retailer, description, affiliateUrl, affiliateId, image, notes } =
      req.body ?? {};

    if (name !== undefined) payload.name = name;
    if (brand !== undefined) payload.brand = brand ?? null;
    if (category !== undefined) payload.category = category ?? null;
    if (price !== undefined) payload.price = parsePrice(price);
    if (url !== undefined) payload.url = url ?? null;
    if (retailer !== undefined) payload.retailer = retailer ?? null;
    if (description !== undefined || notes !== undefined) {
      payload.notes = description ?? notes ?? null;
    }
    if (affiliateUrl !== undefined) payload.affiliateUrl = affiliateUrl ?? null;
    if (affiliateId !== undefined) payload.affiliateId = affiliateId ?? null;
    if (image !== undefined) payload.imageUrl = image ?? null;

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: 'No updates supplied.' });
    }

    const updated = await prisma.registryItem.update({
      where: { id: existing.id },
      data: payload,
      include: includeMentorNotes,
    });

    res.json({ item: updated });
  }),
);

router.delete(
  '/entry/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = resolveTargetUserId(req, req.query.userId);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const item = await prisma.registryItem.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    await prisma.registryItem.delete({ where: { id: item.id } });

    res.status(204).send();
  }),
);

router.get(
  '/notes',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = resolveTargetUserId(req, req.query.userId);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const productId = req.query.productId ? String(req.query.productId) : null;

    if (productId) {
      const note = await prisma.registryNote.findFirst({
        where: { registryItemId: productId, registryItem: { userId } },
        orderBy: { updatedAt: 'desc' },
        include: { registryItem: true },
      });

      return res.json({ note });
    }

    const notes = await prisma.registryNote.findMany({
      where: { registryItem: { userId } },
      orderBy: { updatedAt: 'desc' },
      include: { registryItem: true },
    });

    res.json({ notes });
  }),
);

router.post(
  '/notes',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { productId, note, userId: overrideUserId } = req.body ?? {};
    const userId = resolveTargetUserId(req, overrideUserId);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!productId) {
      return res.status(400).json({ message: 'productId is required.' });
    }

    const registryItem = await prisma.registryItem.findFirst({
      where: { id: productId, userId },
    });

    if (!registryItem) {
      return res.status(404).json({ message: 'Registry item not found.' });
    }

    const trimmed = typeof note === 'string' ? note.trim() : '';
    if (!trimmed) {
      await prisma.registryNote.deleteMany({
        where: { registryItemId: productId, mentorId: req.user.id },
      });
      return res.json({ note: null });
    }

    const record = await prisma.registryNote.upsert({
      where: {
        registryItemId_mentorId: {
          registryItemId: productId,
          mentorId: req.user.id,
        },
      },
      update: { content: trimmed },
      create: { registryItemId: productId, mentorId: req.user.id, content: trimmed },
      include: { registryItem: true },
    });

    res.json({ note: record });
  }),
);

export default router;
