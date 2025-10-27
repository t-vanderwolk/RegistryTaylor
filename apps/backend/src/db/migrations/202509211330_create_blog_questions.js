exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (hasTable) return;

  await knex.schema.createTable('blog_questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.text('question').notNullable();
    table.text('answer');
    table.string('status').notNullable().defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (!hasTable) return;

  await knex.schema.dropTable('blog_questions');
};
