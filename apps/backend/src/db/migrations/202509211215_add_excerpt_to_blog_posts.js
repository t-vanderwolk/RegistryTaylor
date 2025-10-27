exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  const hasExcerpt = await knex.schema.hasColumn('blog_posts', 'excerpt');
  if (!hasExcerpt) {
    await knex.schema.alterTable('blog_posts', (table) => {
      table.text('excerpt');
    });
  }
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  const hasExcerpt = await knex.schema.hasColumn('blog_posts', 'excerpt');
  if (hasExcerpt) {
    await knex.schema.alterTable('blog_posts', (table) => {
      table.dropColumn('excerpt');
    });
  }
};
