const express = require('express');
const { v4: uuid } = require('uuid');
const requireAuth = require('../../middleware/requireAuth');
const db = require('../../db/connection');
const inviteController = require('../../controllers/inviteController');
const contactController = require('../../controllers/contactController');
const academyController = require('../../controllers/academyController');

const router = express.Router();

const bookingsStore = [];
const threadStore = new Map();

const asRegistryPayload = (record = {}) => ({
  id: record.id,
  user_id: record.user_id,
  module_id: record.module_id,
  category: record.category,
  product_name: record.product_name,
  brand: record.brand,
  product_url: record.product_url,
  mentor_tag: record.mentor_tag,
  created_at: record.created_at,
  updated_at: record.updated_at,
});

const asCommunityPayload = (post, replies = []) => ({
  id: post.id,
  user_id: post.user_id,
  module_slug: post.module_slug,
  content: post.content,
  media_url: post.media_url,
  mentor_reply: post.mentor_reply,
  created_at: post.created_at,
  updated_at: post.updated_at,
  replies: replies
    .filter((reply) => reply.post_id === post.id)
    .map((reply) => ({
      id: reply.id,
      post_id: reply.post_id,
      user_id: reply.user_id,
      content: reply.content,
      created_at: reply.created_at,
      updated_at: reply.updated_at,
    })),
});

const ensureThread = (threadId, user) => {
  if (!threadStore.has(threadId)) {
    threadStore.set(threadId, [
      {
        id: uuid(),
        sender_id: user?.id || 'system',
        sender_name: user?.name || 'Taylor Concierge',
        body: 'Welcome to your concierge thread — ask anything, anytime.',
        created_at: new Date().toISOString(),
      },
    ]);
  }
  return threadStore.get(threadId);
};

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [profile] = await db('client_profiles').where({ user_id: userId });
    const mentorAssignment = await db('mentor_assignments as ma')
      .join('users as m', 'm.id', 'ma.mentor_id')
      .select('m.id', 'm.name')
      .where('ma.client_id', userId)
      .first();

    const membershipTier = (profile?.package_choice || 'Concierge').toUpperCase();
    const [firstName = 'Friend'] = (req.user.name || 'Friend').split(' ');
    const mentor = mentorAssignment
      ? { id: mentorAssignment.id, name: mentorAssignment.name }
      : profile?.mentor_preference
      ? { preferred: profile.mentor_preference }
      : null;

    const threadId = mentorAssignment?.id ? `${userId}-${mentorAssignment.id}` : `${userId}-primary`;
    ensureThread(threadId, req.user);

    res.json({
      ok: true,
      user: {
        id: req.user.id,
        firstName,
        role: (req.user.role || 'client').toUpperCase(),
        email: req.user.email,
      },
      membership: { tier: membershipTier },
      mentor,
      threads: [{ id: threadId, type: 'concierge' }],
    });
  } catch (error) {
    next(error);
  }
});

router.get('/registry', requireAuth, (_req, res) => {
  res.json({
    data: [
      {
        id: 'registry-main',
        title: 'Taylor-Made Registry',
        store: 'Babylist',
        url: 'https://www.babylist.com/',
      },
    ],
  });
});

router.get('/bookings', requireAuth, (req, res) => {
  const userId = req.user.id;
  const role = (req.user.role || '').toLowerCase();
  const data = bookingsStore.filter((booking) => {
    if (role === 'mentor') return booking.mentorId === userId;
    return booking.clientId === userId;
  });
  res.json({ data });
});

router.get('/bookings/me', requireAuth, (req, res) => {
  const userId = req.user.id;
  const data = bookingsStore.filter((booking) => booking.mentorId === userId);
  res.json({ data });
});

router.post('/bookings', requireAuth, (req, res) => {
  const { mentorId, startsAt, endsAt, notes } = req.body || {};
  const booking = {
    id: uuid(),
    mentorId: mentorId || 'mentor-demo',
    clientId: req.user.id,
    startsAt: startsAt || new Date().toISOString(),
    endsAt: endsAt || null,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    client: { firstName: (req.user.name || '').split(' ')[0] || 'Client' },
    title: 'Concierge Session',
  };
  bookingsStore.push(booking);
  res.status(201).json({ data: booking });
});

router.get('/registry/:userId', requireAuth, async (req, res, next) => {
  try {
    const requestedUser = req.params.userId;
    const resolvedUser = requestedUser === 'me' ? req.user.id : requestedUser;
    if (resolvedUser !== req.user.id && resolvedUser !== 'user_demo') {
      return res.status(403).json({ error: 'Not authorized to view this registry.' });
    }

    const records = await db('registry_items')
      .where({ user_id: resolvedUser })
      .orderBy('created_at', 'desc');
    res.json({ data: records.map(asRegistryPayload) });
  } catch (error) {
    next(error);
  }
});

router.post('/registry', requireAuth, async (req, res, next) => {
  try {
    const { module_id, category, product_name, brand, product_url, mentor_tag } = req.body || {};
    if (!module_id || !category || !product_name) {
      return res.status(400).json({ error: 'module_id, category, and product_name are required.' });
    }

    const [record] = await db('registry_items')
      .insert({
        user_id: req.user?.id || 'user_demo',
        module_id,
        category,
        product_name,
        brand: brand || null,
        product_url: product_url || null,
        mentor_tag: mentor_tag || null,
      })
      .returning('*');
    res.status(201).json({ data: asRegistryPayload(record) });
  } catch (error) {
    next(error);
  }
});

router.patch('/registry/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = ['category', 'product_name', 'brand', 'product_url', 'mentor_tag'].reduce(
      (acc, field) => {
        if (req.body && Object.prototype.hasOwnProperty.call(req.body, field)) {
          acc[field] = req.body[field];
        }
        return acc;
      },
      {}
    );

    if (!Object.keys(payload).length) {
      return res.status(400).json({ error: 'No updates provided.' });
    }

    const [record] = await db('registry_items')
      .where({ id })
      .update({ ...payload, updated_at: db.fn.now() })
      .returning('*');

    if (!record) {
      return res.status(404).json({ error: 'Registry item not found.' });
    }

    res.json({ data: asRegistryPayload(record) });
  } catch (error) {
    next(error);
  }
});

router.delete('/registry/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db('registry_items').where({ id }).del();
    if (!deleted) {
      return res.status(404).json({ error: 'Registry item not found.' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/threads/:id', requireAuth, (req, res) => {
  const threadId = req.params.id;
  const messages = ensureThread(threadId, req.user);
  res.json({ data: { messages } });
});

router.post('/messages', requireAuth, (req, res) => {
  const { threadId, body } = req.body || {};
  if (!threadId || !body) {
    return res.status(400).json({ error: 'threadId and body are required' });
  }
  const messages = ensureThread(threadId, req.user);
  const message = {
    id: uuid(),
    thread_id: threadId,
    sender_id: req.user.id,
    sender_name: req.user.name,
    body,
    created_at: new Date().toISOString(),
  };
  messages.push(message);
  res.status(201).json({ data: message });
});

router.get('/mentors', async (_req, res, next) => {
  try {
    const mentors = await db('mentor_profiles as mp')
      .join('users as u', 'u.id', 'mp.user_id')
      .select('u.id', 'u.name', 'mp.specialty', 'mp.certifications')
      .orderBy('u.name', 'asc');

    const data = mentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.name,
      specialties: mentor.specialty ? mentor.specialty.split(',').map((item) => item.trim()) : [],
      avatarUrl: null,
      rateCents: 4500,
      certifications: mentor.certifications,
    }));

    res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.post('/invites/redeem', inviteController.redeem);
router.post('/contact', contactController.create);
router.post(
  '/academy/workbook',
  requireAuth,
  (req, res, next) => academyController.saveWorkbookEntry(req, res, next)
);
router.get(
  '/academy/workbook/:userId',
  requireAuth,
  (req, res, next) => academyController.getWorkbookForUser(req, res, next)
);

router.get('/community/:moduleSlug', requireAuth, async (req, res, next) => {
  try {
    const { moduleSlug } = req.params;
    const posts = await db('community_posts')
      .where({ module_slug: moduleSlug })
      .orderBy('created_at', 'asc');

    if (!posts.length) {
      return res.json({ data: [] });
    }

    const replies = await db('community_replies')
      .whereIn(
        'post_id',
        posts.map((post) => post.id)
      )
      .orderBy('created_at', 'asc');

    const payload = posts.map((post) => asCommunityPayload(post, replies));
    res.json({ data: payload });
  } catch (error) {
    next(error);
  }
});

router.post('/community', requireAuth, async (req, res, next) => {
  try {
    const { module_slug, content, media_url } = req.body || {};
    if (!module_slug || !content) {
      return res.status(400).json({ error: 'module_slug and content are required.' });
    }

    const [post] = await db('community_posts')
      .insert({
        user_id: req.user?.id || 'user_demo',
        module_slug,
        content,
        media_url: media_url || null,
      })
      .returning('*');

    res.status(201).json({ data: asCommunityPayload(post, []) });
  } catch (error) {
    next(error);
  }
});

router.patch('/community/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {};
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'mentor_reply')) {
      payload.mentor_reply = req.body.mentor_reply;
    }
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'content')) {
      payload.content = req.body.content;
    }
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'media_url')) {
      payload.media_url = req.body.media_url;
    }

    if (!Object.keys(payload).length) {
      return res.status(400).json({ error: 'No updates provided.' });
    }

    const [updated] = await db('community_posts')
      .where({ id })
      .update({ ...payload, updated_at: db.fn.now() })
      .returning('*');

    if (!updated) {
      return res.status(404).json({ error: 'Community post not found.' });
    }

    const replies = await db('community_replies').where({ post_id: id }).orderBy('created_at', 'asc');
    res.json({ data: asCommunityPayload(updated, replies) });
  } catch (error) {
    next(error);
  }
});

router.post('/community/:id/replies', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body || {};
    if (!content) {
      return res.status(400).json({ error: 'content is required.' });
    }

    const [post] = await db('community_posts').where({ id }).select('id');
    if (!post) {
      return res.status(404).json({ error: 'Community post not found.' });
    }

    const [reply] = await db('community_replies')
      .insert({
        post_id: id,
        user_id: req.user?.id || 'user_demo',
        content,
      })
      .returning('*');

    res.status(201).json({
      data: {
        id: reply.id,
        post_id: reply.post_id,
        user_id: reply.user_id,
        content: reply.content,
        created_at: reply.created_at,
        updated_at: reply.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
