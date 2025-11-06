const { v4: uuid } = require('uuid');
const db = require('../db/connection');

const findMentor = async (clientId) =>
  db('mentor_assignments as ma')
    .join('users as m', 'm.id', 'ma.mentor_id')
    .leftJoin('mentor_profiles as mp', 'mp.user_id', 'm.id')
    .select(
      'm.id',
      'm.name',
      'm.email',
      'm.phone',
      'mp.specialty',
      'mp.availability'
    )
    .where('ma.client_id', clientId)
    .first();

exports.getDashboard = async (req, res, next) => {
  try {
    const clientId = req.user.id;

    const profile = await db('client_profiles').where({ user_id: clientId }).first();
    const mentor = await findMentor(clientId);

    const messages = await db('messages as m')
      .join('users as sender', 'sender.id', 'm.sender_id')
      .select(
        'm.id',
        'sender.id as sender_id',
        'sender.name as sender_name',
        'sender.role as sender_role',
        'm.body',
        'm.read',
        'm.created_at'
      )
      .where('m.thread_id', clientId)
      .orderBy('m.created_at', 'desc')
      .limit(40);

    res.json({
      data: {
        profile,
        mentor: mentor || null,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.listMessages = async (req, res, next) => {
  try {
    const clientId = req.user.id;

    const mentors = await db('mentor_assignments as ma')
      .join('users as m', 'm.id', 'ma.mentor_id')
      .select('m.id', 'm.name', 'm.email')
      .where('ma.client_id', clientId)
      .orderBy('m.name', 'asc');

    const messages = await db('messages as m')
      .join('users as sender', 'sender.id', 'm.sender_id')
      .select(
        'm.id',
        'sender.id as sender_id',
        'sender.name as sender_name',
        'sender.role as sender_role',
        'm.body',
        'm.read',
        'm.created_at'
      )
      .where('m.thread_id', clientId)
      .orderBy('m.created_at', 'asc');

    res.json({
      data: {
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
    const clientId = req.user.id;
    const { body } = req.body;

    if (!body) {
      throw Object.assign(new Error('Message body is required'), { status: 400 });
    }

    const message = {
      id: uuid(),
      thread_id: clientId,
      sender_id: clientId,
      body,
      read: false,
    };

    await db('messages').insert(message);

    const saved = await db('messages as m')
      .join('users as sender', 'sender.id', 'm.sender_id')
      .select(
        'm.id',
        'sender.id as sender_id',
        'sender.name as sender_name',
        'sender.role as sender_role',
        'm.body',
        'm.read',
        'm.created_at'
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
    const clientId = req.user.id;
    const { id } = req.params;

    const message = await db('messages').where({ id }).first();
    if (!message || message.thread_id !== clientId) {
      throw Object.assign(new Error('Message not found'), { status: 404 });
    }

    await db('messages').where({ id }).update({ read: true });

    res.json({ data: { id, read: true } });
  } catch (error) {
    next(error);
  }
};
