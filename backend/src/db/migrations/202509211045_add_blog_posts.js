exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (hasTable) return;

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
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_posts');
  if (!hasTable) return;

  await knex.schema.dropTable('blog_posts');
};
