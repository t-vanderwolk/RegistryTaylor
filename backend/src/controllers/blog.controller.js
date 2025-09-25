const db = require('../db/connection');

let blogTableCheckPromise = null;

const ensureBlogTable = async () => {
  if (!blogTableCheckPromise) {
    blogTableCheckPromise = db.schema.hasTable('blog_posts').then((exists) => {
      if (!exists) {
        const error = new Error('Blog posts table not found. Run latest migrations to enable blog management.');
        error.status = 503;
        throw error;
      }
      return true;
    });
  }

  return blogTableCheckPromise;
};

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const deriveExcerpt = (content, provided) => {
  if (provided && provided.trim().length) return provided.trim();
  if (!content) return null;
  const condensed = content.replace(/\s+/g, ' ').trim();
  return condensed.slice(0, 280);
};

const ensureUniqueSlug = async (baseSlug, { excludeId } = {}) => {
  let candidate = baseSlug;
  let suffix = 1;

  const exists = async (slug) => {
    const query = db('blog_posts').where({ slug });
    if (excludeId) {
      query.andWhereNot({ id: excludeId });
    }
    const record = await query.first('id');
    return Boolean(record);
  };

  while (!candidate || (await exists(candidate))) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const serializePost = (record) => ({
  id: record.id,
  title: record.title,
  slug: record.slug,
  content: record.content,
  category: record.category,
  excerpt: record.excerpt,
  authorId: record.author_id,
  visibility: record.visibility,
  publishedAt: record.published_at,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

exports.listPosts = async (req, res, next) => {
  try {
    await ensureBlogTable();
    const { category, visibility } = req.query;
    let query = db('blog_posts').select('*').orderBy('published_at', 'desc');

    if (category) {
      query = query.where({ category });
    }

    if (visibility && visibility !== 'all') {
      query = query.where({ visibility });
    }

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
    await ensureBlogTable();
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
    await ensureBlogTable();
    const { title, slug, content, category, visibility = 'public', excerpt, published_at: publishedAt } = req.body;

    if (!title || !title.trim()) {
      throw Object.assign(new Error('Title is required'), { status: 400 });
    }
    if (!category || !category.trim()) {
      throw Object.assign(new Error('Category is required'), { status: 400 });
    }
    if (!content || !content.trim()) {
      throw Object.assign(new Error('Content is required'), { status: 400 });
    }

    const authorId = req.user?.id || null;
    const normalizedTitle = title.trim();
    const normalizedCategory = category.trim();
    const normalizedContent = content.trim();
    const initialSlug = slug && slug.trim().length ? slugify(slug) : slugify(normalizedTitle);
    const baseSlug = initialSlug || `post-${Date.now()}`;
    const uniqueSlug = await ensureUniqueSlug(baseSlug);
    const postExcerpt = deriveExcerpt(normalizedContent, excerpt);

    const payload = {
      title: normalizedTitle,
      slug: uniqueSlug,
      category: normalizedCategory,
      excerpt: postExcerpt,
      content: normalizedContent,
      visibility: visibility === 'members_only' ? 'members_only' : 'public',
      author_id: authorId,
    };

    if (publishedAt) {
      payload.published_at = new Date(publishedAt);
    }

    const inserted = await db('blog_posts').insert(payload).returning('*');
    res.status(201).json({ data: serializePost(inserted[0]) });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    await ensureBlogTable();
    const { title, content, category, visibility, slug, excerpt, published_at: publishedAt } = req.body;
    const updates = { updated_at: db.fn.now() };

    if (title) {
      updates.title = title.trim();
    }
    if (content) {
      const trimmed = content.trim();
      updates.content = trimmed;
      updates.excerpt = deriveExcerpt(trimmed, excerpt);
    } else if (excerpt) {
      updates.excerpt = excerpt.trim();
    }
    if (category) {
      updates.category = category.trim();
    }
    if (visibility) {
      updates.visibility = visibility === 'members_only' ? 'members_only' : 'public';
    }
    if (publishedAt) {
      updates.published_at = new Date(publishedAt);
    }

    if (slug) {
      const normalizedSlug = slugify(slug) || `post-${Date.now()}`;
      updates.slug = await ensureUniqueSlug(normalizedSlug, { excludeId: req.params.id });
    }

    const allowedUpdateKeys = ['title', 'content', 'category', 'visibility', 'slug', 'published_at', 'excerpt'];
    const hasFieldUpdate = allowedUpdateKeys.some((key) => Object.prototype.hasOwnProperty.call(updates, key));

    if (!hasFieldUpdate) {
      throw Object.assign(new Error('No update fields provided'), { status: 400 });
    }

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
    await ensureBlogTable();
    const deleted = await db('blog_posts').where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Post not found' } });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
