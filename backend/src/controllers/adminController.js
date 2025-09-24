const db = require('../db/connection');
const { normalizeEmail } = require('../utils/crypto');

const randomCode = (role) => `${role.substring(0, 3).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

exports.createInvite = async (req, res, next) => {
  try {
    const { role, assigned_name, assigned_email, expires_at, single_use = true } = req.body;

    if (!role || !['admin', 'mentor', 'client'].includes(role)) {
      throw Object.assign(new Error('Valid role is required'), { status: 400 });
    }

    const code = randomCode(role);

    await db('invite_codes').insert({
      code,
      role,
      assigned_name: assigned_name || null,
      assigned_email: assigned_email ? normalizeEmail(assigned_email) : null,
      expires_at: expires_at || null,
      single_use,
    });

    res.status(201).json({ data: { code } });
  } catch (error) {
    next(error);
  }
};

exports.listInvites = async (req, res, next) => {
  try {
    const invites = await db('invite_codes').orderBy('created_at', 'desc');
    res.json({ data: invites });
  } catch (error) {
    next(error);
  }
};

exports.listClients = async (req, res, next) => {
  try {
    const rawClients = await db('users as u')
      .leftJoin('client_profiles as cp', 'cp.user_id', 'u.id')
      .leftJoin('mentor_assignments as ma', 'ma.client_id', 'u.id')
      .leftJoin('users as mentor', 'mentor.id', 'ma.mentor_id')
      .select(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'u.active',
        'u.created_at',
        'cp.package_choice',
        'cp.due_date',
        'cp.mentor_preference',
        db.raw(
          "COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', mentor.id, 'name', mentor.name)) FILTER (WHERE mentor.id IS NOT NULL), '[]'::jsonb) as mentors"
        ),
        db.raw('COUNT(DISTINCT mentor.id) as mentor_count')
      )
      .where('u.role', 'client')
      .andWhere('u.active', true)
      .groupBy(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'u.active',
        'u.created_at',
        'cp.package_choice',
        'cp.due_date',
        'cp.mentor_preference'
      )
      .orderBy('u.name', 'asc');

    const clients = rawClients.map((client) => ({
      ...client,
      mentor_count: Number(client.mentor_count || 0),
      mentors: Array.isArray(client.mentors) ? client.mentors : [],
    }));

    res.json({ data: clients });
  } catch (error) {
    next(error);
  }
};

exports.listMentors = async (req, res, next) => {
  try {
    const rawMentors = await db('users as u')
      .leftJoin('mentor_profiles as mp', 'mp.user_id', 'u.id')
      .leftJoin('mentor_assignments as ma', 'ma.mentor_id', 'u.id')
      .leftJoin('users as client', 'client.id', 'ma.client_id')
      .select(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'u.active',
        'u.created_at',
        'mp.specialty',
        'mp.availability',
        'mp.max_clients',
        db.raw(
          "COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', client.id, 'name', client.name)) FILTER (WHERE client.id IS NOT NULL), '[]'::jsonb) as clients"
        ),
        db.raw('COUNT(DISTINCT client.id) as client_count')
      )
      .where('u.role', 'mentor')
      .andWhere('u.active', true)
      .groupBy(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'u.active',
        'u.created_at',
        'mp.specialty',
        'mp.availability',
        'mp.max_clients'
      )
      .orderBy('u.name', 'asc');

    const mentors = rawMentors.map((mentor) => ({
      ...mentor,
      client_count: Number(mentor.client_count || 0),
      max_clients: mentor.max_clients === null ? null : Number(mentor.max_clients),
      clients: Array.isArray(mentor.clients) ? mentor.clients : [],
    }));

    res.json({ data: mentors });
  } catch (error) {
    next(error);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const [
      totalUsersRow,
      totalClientsRow,
      activeClientsRow,
      totalMentorsRow,
      activeMentorsRow,
      totalMessagesRow,
      totalInviteRequestsRow,
      pendingInviteRequestsRow,
      approvedInviteRequestsRow,
    ] = await Promise.all([
      db('users').count('* as total_users'),
      db('users').where({ role: 'client' }).count('* as total_clients'),
      db('users').where({ role: 'client', active: true }).count('* as active_clients'),
      db('users').where({ role: 'mentor' }).count('* as total_mentors'),
      db('users').where({ role: 'mentor', active: true }).count('* as active_mentors'),
      db('messages').count('* as total_messages'),
      db('invite_requests').count('* as total_invite_requests'),
      db('invite_requests').where({ status: 'pending' }).count('* as pending_invite_requests'),
      db('invite_requests').where({ status: 'approved' }).count('* as approved_invite_requests'),
    ]);

    const recentInvites = await db('invite_codes').orderBy('created_at', 'desc').limit(10);

    const asNumber = (rows, key) => Number(rows?.[0]?.[key] ?? 0);

    res.json({
      data: {
        stats: {
          total_users: asNumber(totalUsersRow, 'total_users'),
          total_clients: asNumber(totalClientsRow, 'total_clients'),
          active_clients: asNumber(activeClientsRow, 'active_clients'),
          total_mentors: asNumber(totalMentorsRow, 'total_mentors'),
          active_mentors: asNumber(activeMentorsRow, 'active_mentors'),
          total_messages: asNumber(totalMessagesRow, 'total_messages'),
          total_invite_requests: asNumber(totalInviteRequestsRow, 'total_invite_requests'),
          pending_invite_requests: asNumber(pendingInviteRequestsRow, 'pending_invite_requests'),
          approved_invite_requests: asNumber(approvedInviteRequestsRow, 'approved_invite_requests'),
        },
        recent_invites: recentInvites,
      },
    });
  } catch (error) {
    next(error);
  }
};
