const express = require('express');
const { v4: uuid } = require('uuid');
const requireAuth = require('../../middleware/requireAuth');
const db = require('../../db/connection');

const router = express.Router();

const bookingsStore = [];
const threadStore = new Map();

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

router.post('/invites/redeem', (req, res) => {
  const { code } = req.body || {};
  if (typeof code === 'string' && code.trim().length >= 6) {
    return res.json({ ok: true });
  }
  return res.status(400).json({ ok: false, error: 'Invalid code' });
});

module.exports = router;
