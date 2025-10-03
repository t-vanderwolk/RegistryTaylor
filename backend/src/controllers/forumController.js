const { v4: uuid } = require('uuid');
const db = require('../db/connection');

const ensureRole = (user, allowed) => {
  if (!user || !allowed.includes(user.role)) {
    const error = new Error('Forbidden');
    error.status = 403;
    throw error;
  }
};

exports.list = async (req, res, next) => {
  try {
    const posts = await db('private_blog_posts').orderBy('created_at', 'desc');
    res.json({ data: posts });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    ensureRole(req.user, ['client', 'mentor', 'admin']);
    const { title, category, content } = req.body;
    if (!title || !category || !content) {
      throw Object.assign(new Error('title, category, and content are required'), { status: 400 });
    }

    const [post] = await db('private_blog_posts')
      .insert({
        id: uuid(),
        title,
        category,
        content,
        author_id: req.user.id,
      })
      .returning('*');

    res.status(201).json({ data: post });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    ensureRole(req.user, ['mentor', 'admin']);
    const { id } = req.params;
    const { title, category, content } = req.body;
    if (!title || !category || !content) {
      throw Object.assign(new Error('title, category, and content are required'), { status: 400 });
    }

    const [post] = await db('private_blog_posts')
      .where({ id })
      .update({
        title,
        category,
        content,
        updated_at: db.fn.now(),
      })
      .returning('*');

    if (!post) {
      throw Object.assign(new Error('Post not found'), { status: 404 });
    }

    res.json({ data: post });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    ensureRole(req.user, ['admin']);
    const { id } = req.params;
    const deleted = await db('private_blog_posts').where({ id }).del();
    if (!deleted) {
      throw Object.assign(new Error('Post not found'), { status: 404 });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
