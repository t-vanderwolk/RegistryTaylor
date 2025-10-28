const express = require('express');
const prisma = require('../../../db/prisma');
const asyncHandler = require('../../../utils/asyncHandler');
const { requireUser, requireMember } = require('../../../middleware/auth');
const { ensureAffiliate } = require('../../../services/onboarding');

const router = express.Router();

const toNumeric = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

router.get(
  '/items',
  requireUser,
  asyncHandler(async (_req, res) => {
    const items = await prisma.registryItem.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ items: items.map((item) => ({ ...item, url: ensureAffiliate(item.url) })) });
  })
);

router.post(
  '/add',
  requireMember,
  asyncHandler(async (req, res) => {
    const { itemId, name, brand, price, url, notes, quantity, retailer, imageUrl } = req.body || {};

    if (!itemId && !name) {
      return res.status(400).json({ error: { message: 'Provide an existing itemId or a name for the registry entry' } });
    }

    let sourceItem = null;
    if (itemId) {
      sourceItem = await prisma.registryItem.findUnique({ where: { id: itemId } });
      if (!sourceItem) {
        return res.status(404).json({ error: { message: 'Registry item not found' } });
      }
    }

    const qty =
      quantity === undefined || quantity === null || Number.isNaN(Number(quantity))
        ? 1
        : Number(quantity);

    const entry = await prisma.registryEntry.create({
      data: {
        userId: req.user.id,
        itemId: sourceItem ? sourceItem.id : null,
        name: name || sourceItem.name,
        brand: brand ?? sourceItem?.brand ?? null,
        price: toNumeric(price ?? sourceItem?.price ?? null),
        retailer: retailer ?? sourceItem?.retailer ?? null,
        imageUrl: imageUrl ?? sourceItem?.imageUrl ?? null,
        url: ensureAffiliate(url ?? sourceItem?.url ?? null),
        notes: notes ?? sourceItem?.notes ?? null,
        quantity: qty,
      },
    });

    return res.status(201).json({ entry });
  })
);

router.get(
  '/:id',
  requireMember,
  asyncHandler(async (req, res) => {
    const entry = await prisma.registryEntry.findUnique({
      where: { id: req.params.id },
    });

    if (!entry || entry.userId !== req.user.id) {
      return res.status(404).json({ error: { message: 'Registry entry not found' } });
    }

    return res.json({ entry: { ...entry, url: ensureAffiliate(entry.url) } });
  })
);

router.put(
  '/:id',
  requireMember,
  asyncHandler(async (req, res) => {
    const existing = await prisma.registryEntry.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: { message: 'Registry entry not found' } });
    }

    const { name, brand, price, url, notes, quantity, retailer, imageUrl } = req.body || {};

    const parsedQuantity =
      quantity === undefined || quantity === null || Number.isNaN(Number(quantity))
        ? existing.quantity
        : Number(quantity);

    const entry = await prisma.registryEntry.update({
      where: { id: req.params.id },
      data: {
        name: name ?? existing.name,
        brand: brand ?? existing.brand,
        price: toNumeric(price ?? existing.price),
        retailer: retailer ?? existing.retailer,
        imageUrl: imageUrl ?? existing.imageUrl,
        url: ensureAffiliate(url ?? existing.url),
        notes: notes ?? existing.notes,
        quantity: parsedQuantity,
      },
    });

    return res.json({ entry });
  })
);

router.delete(
  '/:id',
  requireMember,
  asyncHandler(async (req, res) => {
    const existing = await prisma.registryEntry.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ error: { message: 'Registry entry not found' } });
    }

    await prisma.registryEntry.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  })
);

module.exports = router;
