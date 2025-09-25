exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (!hasTable) return;

  const hasEmail = await knex.schema.hasColumn('blog_questions', 'email');
  if (!hasEmail) {
    await knex.schema.alterTable('blog_questions', (table) => {
      table.string('email').notNullable().defaultTo('placeholder@example.com');
    });

    await knex('blog_questions')
      .where({ email: 'placeholder@example.com' })
      .update({ email: knex.raw("COALESCE(name || '@placeholder.com', 'guest@placeholder.com')") });

    await knex.schema.alterTable('blog_questions', (table) => {
      table.string('email').notNullable().alter();
    });
  }
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (!hasTable) return;

  const hasEmail = await knex.schema.hasColumn('blog_questions', 'email');
  if (hasEmail) {
    await knex.schema.alterTable('blog_questions', (table) => {
      table.dropColumn('email');
    });
  }
};
