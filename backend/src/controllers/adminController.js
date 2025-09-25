const { v4: uuid } = require('uuid');
const db = require('../db/connection');
const { normalizeEmail } = require('../utils/crypto');

const randomCode = (role) => `${role.substring(0, 3).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

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

exports.getClientDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await db('users as u')
      .leftJoin('client_profiles as cp', 'cp.user_id', 'u.id')
      .select(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'u.zip_code',
        'u.created_at',
        'cp.parent_one_name',
        'cp.parent_two_name',
        'cp.baby_name',
        'cp.baby_gender',
        'cp.due_date',
        'cp.package_choice',
        'cp.mentor_preference',
        'cp.family_intro'
      )
      .where('u.id', id)
      .andWhere('u.role', 'client')
      .first();

    if (!client) {
      throw Object.assign(new Error('Client not found'), { status: 404 });
    }

    const mentors = await db('mentor_assignments as ma')
      .join('users as m', 'm.id', 'ma.mentor_id')
      .leftJoin('mentor_profiles as mp', 'mp.user_id', 'm.id')
      .select('m.id', 'm.name', 'm.email', 'm.phone', 'mp.specialty', 'mp.availability')
      .where('ma.client_id', id)
      .orderBy('m.name', 'asc');

    const invites = await db('invite_codes')
      .whereRaw('LOWER(assigned_email) = ?', normalizeEmail(client.email))
      .orderBy('created_at', 'desc');

    const messages = await db('messages as m')
      .join('users as sender', 'sender.id', 'm.sender_id')
      .select(
        'm.id',
        'm.body',
        'm.created_at',
        'm.read',
        'sender.id as sender_id',
        'sender.name as sender_name',
        'sender.role as sender_role'
      )
      .where('m.thread_id', id)
      .orderBy('m.created_at', 'asc');

    res.json({
      data: {
        client,
        mentors,
        invites,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMentorDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mentor = await db('users as u')
      .leftJoin('mentor_profiles as mp', 'mp.user_id', 'u.id')
      .select(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'u.created_at',
        'mp.specialty',
        'mp.bio',
        'mp.availability',
        'mp.max_clients',
        'mp.certifications'
      )
      .where('u.id', id)
      .andWhere('u.role', 'mentor')
      .first();

    if (!mentor) {
      throw Object.assign(new Error('Mentor not found'), { status: 404 });
    }

    const clients = await db('mentor_assignments as ma')
      .join('users as c', 'c.id', 'ma.client_id')
      .leftJoin('client_profiles as cp', 'cp.user_id', 'c.id')
      .select('c.id', 'c.name', 'c.email', 'c.phone', 'cp.package_choice', 'cp.due_date')
      .where('ma.mentor_id', id)
      .orderBy('c.name', 'asc');

    const invites = await db('invite_codes')
      .whereRaw('LOWER(assigned_email) = ?', normalizeEmail(mentor.email))
      .orderBy('created_at', 'desc');

    let messages = [];
    const clientIds = clients.map((client) => client.id);
    if (clientIds.length) {
      messages = await db('messages as m')
        .join('users as sender', 'sender.id', 'm.sender_id')
        .select(
          'm.id',
          'm.thread_id',
          'm.body',
          'm.created_at',
          'm.read',
          'sender.id as sender_id',
          'sender.name as sender_name',
          'sender.role as sender_role'
        )
        .whereIn('m.thread_id', clientIds)
        .orderBy('m.created_at', 'asc');
    }

    res.json({
      data: {
        mentor: {
          ...mentor,
          certifications: parseJsonArray(mentor.certifications),
        },
        clients,
        invites,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.calendar = async (req, res, next) => {
  try {
    const now = new Date();
    const startWindow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 3, 1));
    const endWindow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 4, 1));

    const clientEvents = await db('client_profiles as cp')
      .join('users as u', 'u.id', 'cp.user_id')
      .select('u.id as client_id', 'u.name', 'cp.due_date')
      .whereNotNull('cp.due_date')
      .andWhere('cp.due_date', '>=', startWindow)
      .andWhere('cp.due_date', '<', endWindow);

    const inviteEvents = await db('invite_requests')
      .select('id', 'name', 'created_at', 'handled_at', 'status')
      .whereBetween('created_at', [startWindow, endWindow]);

    const mentorOnboardEvents = await db('users as u')
      .where({ role: 'mentor' })
      .andWhere('created_at', '>=', startWindow)
      .andWhere('created_at', '<', endWindow)
      .select('u.id', 'u.name', 'u.created_at');

    const events = [];

    clientEvents.forEach((item) => {
      events.push({
        id: `client-${item.client_id}`,
        type: 'client_due_date',
        title: `${item.name} due date`,
        date: item.due_date,
      });
    });

    inviteEvents.forEach((item) => {
      events.push({
        id: `invite-${item.id}`,
        type: 'invite_request',
        title: `${item.name} request (${item.status})`,
        date: item.created_at,
      });
      if (item.handled_at) {
        events.push({
          id: `invite-${item.id}-handled`,
          type: 'invite_handled',
          title: `${item.name} ${item.status}`,
          date: item.handled_at,
        });
      }
    });

    mentorOnboardEvents.forEach((item) => {
      events.push({
        id: `mentor-${item.id}`,
        type: 'mentor_onboarded',
        title: `${item.name} joined concierge team`,
        date: item.created_at,
      });
    });

    res.json({ data: events });
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
      recentInvites,
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
      db('invite_codes').orderBy('created_at', 'desc').limit(10),
    ]);

    const asNumber = (rows, key) => Number(rows?.[0]?.[key] ?? 0);
    const countRange = async ({ table, column, from, to, where = {} }) => {
      const [row] = await db(table)
        .where(where)
        .where(column, '>=', from)
        .andWhere(column, '<', to)
        .count('* as count');
      return Number(row?.count ?? 0);
    };

    const now = new Date();
    const monthlyMetrics = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
      const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset + 1, 1));
      const monthKey = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`;

      const [invitesCount, newClientsCount, messagesCount] = await Promise.all([
        countRange({ table: 'invite_requests', column: 'created_at', from: start, to: end }),
        countRange({ table: 'users', column: 'created_at', from: start, to: end, where: { role: 'client' } }),
        countRange({ table: 'messages', column: 'created_at', from: start, to: end }),
      ]);

      monthlyMetrics.push({
        month: monthKey,
        invites: invitesCount,
        new_clients: newClientsCount,
        messages: messagesCount,
      });
    }

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
        engagement: monthlyMetrics,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.listMessageThreads = async (req, res, next) => {
  try {
    const clients = await db('users as c')
      .leftJoin('client_profiles as cp', 'cp.user_id', 'c.id')
      .select('c.id', 'c.name', 'c.email', 'c.created_at', 'cp.package_choice')
      .where('c.role', 'client')
      .orderBy('c.name', 'asc');

    const threadIds = clients.map((client) => client.id);

    let latestMessagesMap = {};
    let unreadCountMap = {};

    if (threadIds.length) {
      const lastTimestampsQuery = db('messages')
        .select('thread_id')
        .max('created_at as last_created_at')
        .whereIn('thread_id', threadIds)
        .groupBy('thread_id');

      const latestMessages = await db('messages as m')
        .join('users as sender', 'sender.id', 'm.sender_id')
        .join(
          lastTimestampsQuery.as('last'),
          function joinLatest() {
            this.on('last.thread_id', 'm.thread_id').andOn('last.last_created_at', 'm.created_at');
          }
        )
        .select(
          'm.thread_id',
          'm.body',
          'm.created_at',
          'sender.name as sender_name',
          'sender.role as sender_role'
        );

      if (latestMessages.length) {
        latestMessagesMap = latestMessages.reduce((acc, item) => {
          acc[item.thread_id] = {
            body: item.body,
            created_at: item.created_at,
            sender_name: item.sender_name,
            sender_role: item.sender_role,
          };
          return acc;
        }, {});
      }

      const unreadCounts = await db('messages')
        .select('thread_id')
        .count('* as count')
        .whereIn('thread_id', threadIds)
        .andWhere('read', false)
        .andWhereNot('sender_id', req.user.id)
        .groupBy('thread_id');

      unreadCountMap = unreadCounts.reduce((acc, item) => {
        acc[item.thread_id] = Number(item.count || 0);
        return acc;
      }, {});
    }

    const threads = clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      package: client.package_choice,
      joined_at: client.created_at,
      last_message: latestMessagesMap[client.id] || null,
      unread_count: unreadCountMap[client.id] || 0,
    }));

    res.json({ data: threads });
  } catch (error) {
    next(error);
  }
};

exports.getThreadMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const client = await db('users').where({ id, role: 'client' }).first();
    if (!client) {
      throw Object.assign(new Error('Client not found'), { status: 404 });
    }

    const mentors = await db('mentor_assignments as ma')
      .join('users as m', 'm.id', 'ma.mentor_id')
      .select('m.id', 'm.name', 'm.email')
      .where('ma.client_id', id)
      .orderBy('m.name', 'asc');

    const messages = await db('messages as m')
      .join('users as sender', 'sender.id', 'm.sender_id')
      .select(
        'm.id',
        'm.thread_id',
        'm.body',
        'm.created_at',
        'm.read',
        'sender.id as sender_id',
        'sender.name as sender_name',
        'sender.role as sender_role'
      )
      .where('m.thread_id', id)
      .orderBy('m.created_at', 'asc');

    res.json({
      data: {
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
        },
        mentors,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const { client_id: clientId, body } = req.body;

    if (!clientId || !body) {
      throw Object.assign(new Error('client_id and body are required'), { status: 400 });
    }

    const client = await db('users').where({ id: clientId, role: 'client' }).first();
    if (!client) {
      throw Object.assign(new Error('Client not found'), { status: 404 });
    }

    const message = {
      id: uuid(),
      thread_id: clientId,
      sender_id: adminId,
      body,
      read: false,
    };

    await db('messages').insert(message);

    const saved = await db('messages as m')
      .join('users as sender', 'sender.id', 'm.sender_id')
      .select(
        'm.id',
        'm.thread_id',
        'm.body',
        'm.created_at',
        'm.read',
        'sender.id as sender_id',
        'sender.name as sender_name',
        'sender.role as sender_role'
      )
      .where('m.id', message.id)
      .first();

    res.status(201).json({ data: saved });
  } catch (error) {
    next(error);
  }
};

exports.markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await db('messages').where({ id }).first();
    if (!message) {
      throw Object.assign(new Error('Message not found'), { status: 404 });
    }

    await db('messages').where({ id }).update({ read: true });

    res.json({ data: { id, read: true } });
  } catch (error) {
    next(error);
  }
};
