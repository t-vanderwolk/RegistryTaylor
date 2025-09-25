const { v4: uuid } = require('uuid');
const db = require('../db/connection');

const serialize = (record, { includeEmail = false } = {}) => ({
  id: record.id,
  username: record.username,
  email: includeEmail ? record.email : undefined,
  question: record.question,
  answer: record.answer,
  status: record.status,
  assigned_to: record.assigned_to || null,
  assigned_name: record.assigned_name || null,
  created_at: record.created_at,
  updated_at: record.updated_at,
});

exports.listPublic = async (_req, res, next) => {
  try {
    const questions = await db('blog_questions').orderBy('created_at', 'desc');

    const data = questions.map((item) => {
      const serialized = serialize(item);
      if (serialized.email !== undefined) {
        delete serialized.email;
      }
      if (serialized.status !== 'published') {
        serialized.answer = null;
      }
      return serialized;
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.submitQuestion = async (req, res, next) => {
  try {
    const { username, email, question } = req.body;

    if (!username || !username.trim()) {
      const err = new Error('Username is required');
      err.status = 400;
      throw err;
    }

    if (!email || !email.trim()) {
      const err = new Error('Email is required');
      err.status = 400;
      throw err;
    }

    if (!question || !question.trim()) {
      const err = new Error('Question is required');
      err.status = 400;
      throw err;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      const err = new Error('Valid email is required');
      err.status = 400;
      throw err;
    }

    const payload = {
      id: uuid(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      question: question.trim(),
      status: 'pending',
    };

    await db('blog_questions').insert(payload);

    const serialized = serialize(payload);
    delete serialized.email;

    res.status(201).json({ data: serialized });
  } catch (error) {
    next(error);
  }
};

exports.listAll = async (_req, res, next) => {
  try {
    const questions = await db('blog_questions as q')
      .leftJoin('users as u', 'u.id', 'q.assigned_to')
      .select(
        'q.*',
        'u.name as assigned_name'
      )
      .orderBy('q.created_at', 'desc');

    res.json({ data: questions.map((record) => serialize(record, { includeEmail: true })) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
  const { name, email, question, answer, status, assigned_to: assignedTo } = req.body;

  const updates = {
    updated_at: db.fn.now(),
  };

    if (name !== undefined) updates.username = name?.trim() || null;
    if (username !== undefined) updates.username = username?.trim() || null;
  if (email !== undefined) {
    const trimmedEmail = email?.trim();
    if (!trimmedEmail) {
      const err = new Error('Email is required');
      err.status = 400;
      throw err;
    }
    updates.email = trimmedEmail.toLowerCase();
  }
    if (question !== undefined) updates.question = question?.trim();
    if (answer !== undefined) updates.answer = answer?.trim() || null;
    if (status !== undefined) updates.status = status;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo || null;

    const updated = await db('blog_questions').where({ id }).update(updates).returning('*');
    if (!updated.length) {
      const err = new Error('Question not found');
      err.status = 404;
      throw err;
    }

    const [record] = await db('blog_questions as q')
      .leftJoin('users as u', 'u.id', 'q.assigned_to')
      .select('q.*', 'u.name as assigned_name')
      .where('q.id', id)
      .limit(1);

    res.json({ data: serialize(record, { includeEmail: true }) });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await db('blog_questions').where({ id }).del();
    if (!deleted) {
      const err = new Error('Question not found');
      err.status = 404;
      throw err;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
