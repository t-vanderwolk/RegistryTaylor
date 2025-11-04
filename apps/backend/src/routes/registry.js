import express from 'express';
import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/catalog',
  asyncHandler(async (_req, res) => {
    const items = await prisma.registryCatalogItem.findMany({
      orderBy: [{ source: 'asc' }, { title: 'asc' }],
    });

    res.json({ items });
  }),
);

router.post(
  '/entry',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { itemId, item, notes } = req.body;

    if (itemId) {
      const existing = await prisma.registryItem.findFirst({
        where: { id: itemId, userId: req.user.id },
      });

      if (!existing) {
        return res.status(404).json({ message: 'Registry item not found.' });
      }

      const updated = await prisma.registryItem.update({
        where: { id: existing.id },
        data: {
          notes: typeof notes === 'string' ? notes : existing.notes,
        },
      });

      return res.status(200).json({ item: updated });
    }

    if (!item || !item.name) {
      return res.status(400).json({ message: 'Item details are required.' });
    }

    const externalId = (item.externalId || item.name)
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      || `manual-${Date.now()}`;

    const created = await prisma.registryItem.upsert({
      where: {
        externalId_userId: {
          externalId,
          userId: req.user.id,
        },
      },
      update: {
        name: item.name,
        brand: item.brand ?? null,
        category: item.category ?? null,
        price: item.price ?? null,
        url: item.url ?? null,
        retailer: item.retailer ?? null,
        notes: typeof notes === 'string' ? notes : item.notes ?? null,
        source: item.source ?? 'static',
        affiliateUrl: item.affiliateUrl ?? item.url ?? null,
        affiliateId: item.affiliateId ?? externalId,
        importedFrom: item.importedFrom ?? item.url ?? null,
        imageUrl: item.imageUrl ?? null,
      },
      create: {
        userId: req.user.id,
        name: item.name,
        brand: item.brand ?? null,
        category: item.category ?? null,
        price: item.price ?? null,
        url: item.url ?? null,
        retailer: item.retailer ?? null,
        notes: typeof notes === 'string' ? notes : item.notes ?? null,
        source: item.source ?? 'static',
        affiliateUrl: item.affiliateUrl ?? item.url ?? null,
        affiliateId: item.affiliateId ?? externalId,
        externalId,
        importedFrom: item.importedFrom ?? item.url ?? null,
        imageUrl: item.imageUrl ?? null,
      },
    });

    res.status(201).json({ item: created });
  }),
);

router.delete(
  '/entry/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const item = await prisma.registryItem.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    await prisma.registryItem.delete({ where: { id: item.id } });

    res.status(204).send();
  }),
);

export default router;
