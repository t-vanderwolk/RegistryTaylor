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

exports.dashboard = async (req, res, next) => {
  try {
    const [{ total_users }] = await db('users').count('* as total_users');
    const [{ total_mentors }] = await db('users').where({ role: 'mentor' }).count('* as total_mentors');
    const [{ total_clients }] = await db('users').where({ role: 'client' }).count('* as total_clients');
    const [{ total_messages }] = await db('messages').count('* as total_messages');

    const recentInvites = await db('invite_codes').orderBy('created_at', 'desc').limit(10);

    res.json({
      data: {
        stats: {
          total_users: Number(total_users),
          total_mentors: Number(total_mentors),
          total_clients: Number(total_clients),
          total_messages: Number(total_messages),
        },
        recent_invites: recentInvites,
      },
    });
  } catch (error) {
    next(error);
  }
};
