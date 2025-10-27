exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  const hasTable = await knex.schema.hasTable('blog_posts');

  if (!hasTable) {
    await knex.schema.createTable('blog_posts', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('title').notNullable();
      table.string('slug').notNullable().unique();
      table.string('category').notNullable();
      table.text('excerpt');
      table.text('content').notNullable();
      table.enu('visibility', ['public', 'members_only']).notNullable().defaultTo('public');
      table.uuid('author_id').references('users.id').onDelete('SET NULL');
      table.timestamp('published_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
    });
    return;
  }

  const ensureColumn = async (column, builder) => {
    const exists = await knex.schema.hasColumn('blog_posts', column);
    if (!exists) {
      await knex.schema.alterTable('blog_posts', builder);
    }
  };

  await ensureColumn('excerpt', (table) => table.text('excerpt'));
  await ensureColumn('visibility', (table) => table.enu('visibility', ['public', 'members_only']).notNullable().defaultTo('public'));
  await ensureColumn('author_id', (table) => table.uuid('author_id').references('users.id').onDelete('SET NULL'));
  await ensureColumn('published_at', (table) => table.timestamp('published_at').defaultTo(knex.fn.now()));
  await ensureColumn('created_at', (table) => table.timestamp('created_at').defaultTo(knex.fn.now()));
  await ensureColumn('updated_at', (table) => table.timestamp('updated_at').defaultTo(knex.fn.now()));
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (hasTable) {
    await knex.schema.dropTable('blog_posts');
  }
};
