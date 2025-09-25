exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  const columnInfo = await knex('blog_posts').columnInfo();
  if (columnInfo.category && columnInfo.category.type !== 'text') {
    await knex.schema.alterTable('blog_posts', (table) => {
      table.text('category').alter();
    });
  }

  await knex.raw(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blog_category') THEN
        DROP TYPE blog_category;
      END IF;
    END
    $$;
  `);
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  const exists = await knex.raw(`SELECT 1 FROM pg_type WHERE typname = 'blog_category'`);
  if (!exists.rowCount) {
    await knex.raw(`CREATE TYPE blog_category AS ENUM ('Announcements', 'Mentor Notes');`);
  }

  await knex.schema.alterTable('blog_posts', (table) => {
    table
      .enu('category', ['Announcements', 'Mentor Notes'], {
        useNative: true,
        enumName: 'blog_category',
      })
      .alter();
  });
};
