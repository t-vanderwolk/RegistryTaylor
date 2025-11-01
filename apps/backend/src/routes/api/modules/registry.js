const express = require('express');
const { RegistrySource, UserRole } = require('@prisma/client');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { requireUser } = require('../../../middleware/auth');

const router = express.Router();

const ALLOWED_SOURCES = new Set(Object.values(RegistrySource));

const parsePrice = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const resolveOwnerId = (requestedUserId, authUser) => {
  if (!requestedUserId || requestedUserId === authUser.id) {
    return authUser.id;
  }
  if (authUser.role === UserRole.MENTOR || authUser.role === UserRole.ADMIN) {
    return requestedUserId;
  }
  const error = new Error('You cannot manage registry items for another member.');
  error.statusCode = 403;
  throw error;
};

const normalizeSource = (value) => {
  if (typeof value !== 'string') {
    return 'macro';
  }
  const lower = value.toLowerCase();
  return ALLOWED_SOURCES.has(lower) ? lower : 'macro';
};

const buildItemPayload = (raw = {}) => {
  const {
    title,
    name,
    brand,
    price,
    category,
    image,
    imageUrl,
    retailer,
    url,
    description,
    notes,
    source,
    affiliateUrl,
    affiliateId,
    externalId,
    importedFrom,
  } = raw;

  if (!title && !name) {
    const error = new Error('A title is required for registry items.');
    error.statusCode = 400;
    throw error;
  }

  const resolvedName = typeof name === 'string' && name.trim().length ? name.trim() : String(title ?? '').trim();

  if (!resolvedName) {
    const error = new Error('A name is required for registry items.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name: resolvedName,
    brand: brand ?? null,
    price: parsePrice(price),
    category: category ?? null,
    imageUrl: imageUrl ?? image ?? null,
    retailer: retailer ?? null,
    url: url ?? null,
    notes: notes ?? description ?? null,
    source: normalizeSource(source),
    affiliateUrl: affiliateUrl ?? null,
    affiliateId: affiliateId ?? null,
    externalId: externalId ?? null,
    importedFrom: importedFrom ?? null,
  };
};

const ensureItemOwner = async (itemId, authUser) => {
  const item = await prisma.registryItem.findUnique({
    where: { id: itemId },
    select: { id: true, userId: true, name: true },
  });

  if (!item) {
    const error = new Error('Registry item not found.');
    error.statusCode = 404;
    throw error;
  }

  if (item.userId !== authUser.id && authUser.role === UserRole.MEMBER) {
    const error = new Error('You do not have access to this registry item.');
    error.statusCode = 403;
    throw error;
  }

  return item;
};

router.get(
  '/',
  requireUser,
  asyncHandler(async (req, res) => {
    const items = await prisma.registryItem.findMany({
      where: { userId: req.user.id },
      include: { mentorNotes: { include: { mentor: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ items });
  })
);

router.post(
  '/',
  requireUser,
  asyncHandler(async (req, res) => {
    const ownerId = resolveOwnerId(req.body?.userId, req.user);
    const payload = buildItemPayload(req.body);

    const item = await prisma.registryItem.create({
      data: {
        userId: ownerId,
        ...payload,
      },
      include: { mentorNotes: { include: { mentor: true } } },
    });

    res.status(201).json({ item });
  })
);

router.put(
  '/:id',
  requireUser,
  asyncHandler(async (req, res) => {
    const existing = await ensureItemOwner(req.params.id, req.user);
    const payload = buildItemPayload({
      name: existing.name,
      ...req.body,
    });

    const item = await prisma.registryItem.update({
      where: { id: existing.id },
      data: payload,
      include: { mentorNotes: { include: { mentor: true } } },
    });

    res.json({ item });
  })
);

router.delete(
  '/:id',
  requireUser,
  asyncHandler(async (req, res) => {
    const existing = await ensureItemOwner(req.params.id, req.user);
    await prisma.registryNote.deleteMany({ where: { registryItemId: existing.id } });
    await prisma.registryItem.delete({ where: { id: existing.id } });
    res.status(204).send();
  })
);

router.post(
  '/:id/note',
  requireUser,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const noteInput = typeof req.body?.note === 'string' ? req.body.note : '';
    const trimmed = noteInput.trim();

    const item = await prisma.registryItem.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!item) {
      return res.status(404).json({ error: { message: 'Registry item not found.' } });
    }

    const mentorId = req.user.id;

    if (!trimmed) {
      await prisma.registryNote.deleteMany({
        where: { registryItemId: id, mentorId },
      });
      return res.json({ note: null });
    }

    const noteRecord = await prisma.registryNote.upsert({
      where: {
        registryItemId_mentorId: {
          registryItemId: id,
          mentorId,
        },
      },
      update: {
        content: trimmed,
      },
      create: {
        registryItemId: id,
        mentorId,
        content: trimmed,
      },
      include: {
        mentor: true,
      },
    });

    res.json({ note: { ...noteRecord, note: noteRecord.content } });
  })
);

module.exports = router;
