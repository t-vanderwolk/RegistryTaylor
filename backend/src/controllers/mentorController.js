const { v4: uuid } = require('uuid');
const db = require('../db/connection');

const ensureAssignment = async (mentorId, clientId) => {
  const assignment = await db('mentor_assignments')
    .where({ mentor_id: mentorId, client_id: clientId })
    .first();
  if (!assignment) {
    const error = new Error('Client is not assigned to this mentor');
    error.status = 403;
    throw error;
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    const clients = await db('mentor_assignments as ma')
      .join('users as u', 'u.id', 'ma.client_id')
      .leftJoin('client_profiles as cp', 'cp.user_id', 'u.id')
      .select(
        'u.id',
        'u.name',
        'u.email',
        'u.phone',
        'cp.package_choice',
        'cp.due_date',
        'cp.baby_name'
      )
      .where('ma.mentor_id', mentorId)
      .orderBy('u.name', 'asc');

    const clientIds = clients.map((c) => c.id);

    let messages = [];
    if (clientIds.length) {
      messages = await db('messages as m')
        .join('users as sender', 'sender.id', 'm.sender_id')
        .select(
          'm.id',
          'm.thread_id as client_id',
          'sender.name as sender_name',
          'sender.role as sender_role',
          'm.body',
          'm.read',
          'm.created_at'
        )
        .whereIn('m.thread_id', clientIds)
        .orderBy('m.created_at', 'desc')
        .limit(40);
    }

    res.json({
      data: {
        clients,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
}; 

exports.sendMessage = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const { client_id, body } = req.body;

    if (!client_id || !body) {
      throw Object.assign(new Error('client_id and body required'), { status: 400 });
    }

    await ensureAssignment(mentorId, client_id);

    const message = {
      id: uuid(),
      thread_id: client_id,
      sender_id: mentorId,
      body,
      read: false,
    };

    await db('messages').insert(message);

    res.status(201).json({ data: message });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const mentorId = req.user.id;

    const mentor = await db('users').where({ id: mentorId }).first();
    if (!mentor) {
      throw Object.assign(new Error('Mentor not found'), { status: 404 });
    }

    const profile = await db('mentor_profiles').where({ user_id: mentorId }).first();

    const clients = await db('mentor_assignments as ma')
      .join('users as u', 'u.id', 'ma.client_id')
      .select('u.id', 'u.name', 'u.email')
      .where('ma.mentor_id', mentorId)
      .orderBy('u.name', 'asc');

    res.json({
      data: {
        mentor: {
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          phone: mentor.phone,
          role: mentor.role,
        },
        profile: profile || null,
        clients,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.markMessageRead = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    const { id } = req.params;

    const message = await db('messages').where({ id }).first();
    if (!message) {
      throw Object.assign(new Error('Message not found'), { status: 404 });
    }

    await ensureAssignment(mentorId, message.thread_id);

    await db('messages').where({ id }).update({ read: true });

    res.json({ data: { id, read: true } });
  } catch (error) {
    next(error);
  }
};
