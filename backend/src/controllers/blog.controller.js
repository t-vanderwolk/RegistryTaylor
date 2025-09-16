const db = require('../db/connection');

const serializePost = (record) => ({
  id: record.id,
  title: record.title,
  slug: record.slug,
  content: record.content,
  category: record.category,
  authorId: record.author_id,
  visibility: record.visibility,
  publishedAt: record.published_at,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

exports.listPosts = async (req, res, next) => {
  try {
    const { category, visibility } = req.query;
    let query = db('blog_posts').select('*').orderBy('published_at', 'desc');
    if (category) query = query.where({ category });
    if (visibility) query = query.where({ visibility });
    if (!req.user || req.user.role === 'guest') {
      query = query.where({ visibility: 'public' });
    }
    const posts = await query;
    res.json({ data: posts.map(serializePost) });
  } catch (error) {
    next(error);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const post = await db('blog_posts').where({ slug: req.params.slug }).first();
    if (!post) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    if (post.visibility === 'members_only' && (!req.user || req.user.role === 'guest')) {
      return res.status(403).json({ error: { message: 'Members only content' } });
    }
    res.json({ data: serializePost(post) });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, slug, content, category, visibility = 'public' } = req.body;
    const authorId = req.user?.id || null;
    const inserted = await db('blog_posts')
      .insert({ title, slug, content, category, visibility, author_id: authorId, published_at: db.fn.now() })
      .returning('*');
    res.status(201).json({ data: serializePost(inserted[0]) });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, category, visibility } = req.body;
    const updates = { updated_at: db.fn.now() };
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (category) updates.category = category;
    if (visibility) updates.visibility = visibility;

    const updated = await db('blog_posts').where({ id: req.params.id }).update(updates).returning('*');
    if (!updated.length) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    res.json({ data: serializePost(updated[0]) });
  } catch (error) {
    next(error);
  }
};

exports.archivePost = async (req, res, next) => {
  try {
    const deleted = await db('blog_posts').where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
