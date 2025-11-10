import express from 'express';
import { randomUUID } from 'node:crypto';

import prisma from '../db/prismaClient.js';
import { requireAuth } from '../middleware/auth.js';
import { logError } from '../utils/logger.js';

const router = express.Router();

const AFFILIATE_MODEL = prisma.affiliateProduct ?? null;

const normalizePrice = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = Number.parseFloat(value.replace(/[^0-9.-]+/g, ''));
    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }

  return 0;
};

const formatString = (value, fallback = '') => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
};

const normalizeRegistryItem = (item, affiliate) => {
  const safeItem = item && typeof item === 'object' ? item : {};
  const mergedPrice = affiliate?.price ?? safeItem.price;

  const mentorNoteSource = affiliate?.mentorNote ?? safeItem.mentorNote ?? null;
  const mentorNote =
    typeof mentorNoteSource === 'string' && mentorNoteSource.trim().length
      ? mentorNoteSource.trim()
      : null;

  return {
    id: String(safeItem.id ?? affiliate?.id ?? randomUUID()),
    name: formatString(affiliate?.name ?? safeItem.name, 'Untitled item'),
    category: formatString(affiliate?.category ?? safeItem.category, 'Misc'),
    price: normalizePrice(mergedPrice),
    image:
      formatString(affiliate?.image ?? safeItem.imageUrl ?? safeItem.image) || '',
    url:
      formatString(
        affiliate?.url ?? safeItem.productUrl ?? safeItem.url,
      ) || '',
    retailer:
      formatString(affiliate?.retailer ?? safeItem.retailerName ?? safeItem.store) ||
      'MyRegistry',
    mentorNote,
  };
};

router.get('/', requireAuth, async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const apiKey = process.env.MYREGISTRY_API_KEY;
  const registryUserId = process.env.MYREGISTRY_USER_ID;

  if (!apiKey || !registryUserId) {
    return res
      .status(500)
      .json({ error: 'Registry integration is not configured.' });
  }

  try {
    const registryResponse = await fetch(
      `https://api.myregistry.com/v1/registries/${registryUserId}/items`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      },
    );

    if (!registryResponse.ok) {
      const upstreamMessage = await registryResponse.text();
      logError('MyRegistry upstream error', upstreamMessage);
      return res
        .status(502)
        .json({ error: 'Failed to fetch registry items from MyRegistry.' });
    }

    const payload = await registryResponse.json();
    const remoteItems = Array.isArray(payload?.items) ? payload.items : [];

    const items = await Promise.all(
      remoteItems.map(async (remoteItem) => {
        if (!AFFILIATE_MODEL || !remoteItem?.name) {
          return normalizeRegistryItem(remoteItem);
        }

        try {
          const affiliate = await AFFILIATE_MODEL.findFirst({
            where: {
              name: {
                contains: remoteItem.name,
                mode: 'insensitive',
              },
            },
          });

          return normalizeRegistryItem(remoteItem, affiliate ?? undefined);
        } catch (affiliateError) {
          logError('Affiliate lookup failed', affiliateError);
          return normalizeRegistryItem(remoteItem);
        }
      }),
    );

    res.json({ items });
  } catch (error) {
    logError('Registry fetch error', error);
    res.status(500).json({ error: 'Failed to load registry.' });
  }
});

export default router;
