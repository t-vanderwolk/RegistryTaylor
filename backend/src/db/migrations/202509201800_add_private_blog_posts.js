exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('private_blog_posts');
  if (!exists) {
    await knex.schema.createTable('private_blog_posts', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('title').notNullable();
      table.string('category').notNullable();
      table.text('content').notNullable();
      table.uuid('author_id').references('users.id').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
};

exports.down = async (knex) => {
  const exists = await knex.schema.hasTable('private_blog_posts');
  if (exists) {
    await knex.schema.dropTable('private_blog_posts');
  }
};
