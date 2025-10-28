const db = require('../db/connection');
const prisma = require('../db/prisma');
const macroBabyService = require('../services/macroBabyService');

const registryStatuses = new Set(['wishlist', 'shortlist', 'ordered', 'arriving', 'fulfilled']);
const mentorRoles = new Set(['mentor', 'admin']);

const sanitiseItem = (item) => ({
  id: item.id,
  productId: item.product_id,
  title: item.title,
  brand: item.brand,
  category: item.category,
  imageUrl: item.image_url,
  affiliateUrl: item.affiliate_url,
  priceCents: item.price_cents,
  quantity: item.quantity,
  status: item.status,
  mentorNotes: item.mentor_notes,
  metadata: item.metadata || {},
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const sanitiseSuggestion = (suggestion) => ({
  id: suggestion.id,
  productId: suggestion.product_id,
  title: suggestion.title,
  brand: suggestion.brand,
  category: suggestion.category,
  imageUrl: suggestion.image_url,
  affiliateUrl: suggestion.affiliate_url,
  priceCents: suggestion.price_cents,
  moduleId: suggestion.module_id,
  moduleTitle: suggestion.module_title || null,
  metadata: suggestion.metadata || {},
});

const pickTargetUserId = (req) => {
  const { userId } = req.query;
  if (userId && mentorRoles.has(req.user.role)) {
    return userId;
  }
  return req.user.id;
};

const ensureStatus = (status) => {
  if (!status) return 'wishlist';
  const normalised = String(status).toLowerCase();
  if (!registryStatuses.has(normalised)) {
    const error = new Error(`Invalid registry status: ${status}`);
    error.status = 400;
    throw error;
  }
  return normalised;
};

const getCoreCompletion = async (userId) => {
  const [{ count: totalCoreRaw }] = await db('academy_modules').where({ is_core: true }).count({ count: '*' });
  const totalCore = Number(totalCoreRaw || 0);
  if (!totalCore) {
    return { totalCore, completedCore: 0, unlocked: true };
  }

  const [{ count: completedCoreRaw }] = await db('academy_progress as ap')
    .join('academy_modules as m', 'm.id', 'ap.module_id')
    .where('ap.user_id', userId)
    .andWhere('m.is_core', true)
    .andWhere('ap.completed', true)
    .count({ count: '*' });

  const completedCore = Number(completedCoreRaw || 0);
  return {
    totalCore,
    completedCore,
    unlocked: completedCore > 0,
  };
};

const fetchSuggestions = async (userId, { categories = [], moduleIds = [] } = {}) => {
  const query = db('registry_suggestions as rs')
    .leftJoin('academy_modules as m', 'm.id', 'rs.module_id')
    .select(
      'rs.*',
      'm.title as module_title',
      'm.registry_focus as module_registry_focus',
      'm.category as module_category'
    )
    .orderBy('rs.created_at', 'desc')
    .limit(60);

  if (categories.length) {
    query.whereIn(db.raw('COALESCE(rs.category, m.registry_focus)'), categories);
  }

  if (moduleIds.length) {
    query.where((builder) => {
      builder.whereIn('rs.module_id', moduleIds).orWhereNull('rs.module_id');
    });
  }

  const rows = await query;
  return rows.map(sanitiseSuggestion);
};

exports.getRegistryItems = async (_req, res, next) => {
  try {
    const items = await prisma.registryItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

exports.getOverview = async (req, res, next) => {
  try {
    const targetUserId = pickTargetUserId(req);

    const [stats, itemsRaw, completedModules] = await Promise.all([
      getCoreCompletion(targetUserId),
      db('registry_items').where({ user_id: targetUserId }).orderBy('created_at', 'desc'),
      db('academy_progress')
        .where({ user_id: targetUserId, completed: true })
        .pluck('module_id'),
    ]);

    const moduleIds = completedModules || [];

    const suggestions = await fetchSuggestions(targetUserId, { moduleIds });

    let macroBabyRecommendations = [];
    try {
      macroBabyRecommendations = await macroBabyService.fetchProducts({
        categories: suggestions.slice(0, 4).map((item) => item.category).filter(Boolean),
      });
    } catch (macroError) {
      req.app?.get('logger')?.warn('MacroBaby API unavailable', { error: macroError.message });
    }

    res.json({
      data: {
        unlocked: stats.unlocked,
        totalCore: stats.totalCore,
        completedCore: stats.completedCore,
        items: itemsRaw.map(sanitiseItem),
        suggestions,
        macroBaby: macroBabyRecommendations,
      },
      meta: {
        userId: targetUserId,
        mentorView: targetUserId !== req.user.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.listItems = async (req, res, next) => {
  try {
    const targetUserId = pickTargetUserId(req);
    const items = await db('registry_items').where({ user_id: targetUserId }).orderBy('created_at', 'desc');
    res.json({
      data: items.map(sanitiseItem),
      meta: {
        userId: targetUserId,
        mentorView: targetUserId !== req.user.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const body = req.body || {};
    const targetUserId =
      mentorRoles.has(req.user.role) && body.userId ? body.userId : req.user.id;

    if (!body.title) {
      const error = new Error('title is required');
      error.status = 400;
      throw error;
    }

    const [created] = await db('registry_items')
      .insert({
        user_id: targetUserId,
        product_id: body.productId || null,
        title: body.title,
        brand: body.brand || null,
        category: body.category || null,
        image_url: body.imageUrl || null,
        affiliate_url: body.affiliateUrl || null,
        price_cents: body.priceCents || null,
        quantity: body.quantity || 1,
        status: ensureStatus(body.status),
        mentor_notes: body.mentorNotes || null,
        metadata: body.metadata || {},
      })
      .returning('*');

    res.status(201).json({
      data: sanitiseItem(created),
      meta: { userId: targetUserId },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const item = await db('registry_items').where({ id }).first();
    if (!item) {
      const notFound = new Error('Registry item not found');
      notFound.status = 404;
      throw notFound;
    }

    if (item.user_id !== req.user.id && !mentorRoles.has(req.user.role)) {
      const forbidden = new Error('Forbidden');
      forbidden.status = 403;
      throw forbidden;
    }

    const payload = {};
    if (body.title !== undefined) payload.title = body.title;
    if (body.brand !== undefined) payload.brand = body.brand;
    if (body.category !== undefined) payload.category = body.category;
    if (body.imageUrl !== undefined) payload.image_url = body.imageUrl;
    if (body.affiliateUrl !== undefined) payload.affiliate_url = body.affiliateUrl;
    if (body.priceCents !== undefined) payload.price_cents = body.priceCents;
    if (body.quantity !== undefined) payload.quantity = body.quantity;
    if (body.status !== undefined) payload.status = ensureStatus(body.status);
    if (body.mentorNotes !== undefined) payload.mentor_notes = body.mentorNotes;
    if (body.metadata !== undefined) payload.metadata = body.metadata;

    payload.updated_at = db.fn.now();

    const [updated] = await db('registry_items').where({ id }).update(payload).returning('*');

    res.json({ data: sanitiseItem(updated) });
  } catch (error) {
    next(error);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await db('registry_items').where({ id }).first();
    if (!item) {
      const notFound = new Error('Registry item not found');
      notFound.status = 404;
      throw notFound;
    }

    if (item.user_id !== req.user.id && !mentorRoles.has(req.user.role)) {
      const forbidden = new Error('Forbidden');
      forbidden.status = 403;
      throw forbidden;
    }

    await db('registry_items').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getCatalog = async (req, res, next) => {
  try {
    const { category, moduleId } = req.query;

    const categories = category ? String(category).split(',').map((value) => value.trim()) : [];
    const moduleFilter = moduleId ? String(moduleId).split(',').map((value) => value.trim()) : [];

    const suggestions = await fetchSuggestions(req.user.id, {
      categories,
      moduleIds: moduleFilter,
    });

    let macroBaby = [];
    try {
      macroBaby = await macroBabyService.fetchProducts({ categories });
    } catch (macroError) {
      req.app?.get('logger')?.warn('MacroBaby fetch failed', { error: macroError.message });
    }

    res.json({
      data: {
        suggestions,
        macroBaby,
      },
    });
  } catch (error) {
    next(error);
  }
};
