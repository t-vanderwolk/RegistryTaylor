exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  await knex('blog_posts')
    .where({ slug: 'taylor-made-concierge-preview' })
    .del();
};

exports.down = async (knex) => {
  // No-op: preview post intentionally removed.
};
