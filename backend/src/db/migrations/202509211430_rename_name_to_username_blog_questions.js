exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (!hasTable) return;

  const hasUsername = await knex.schema.hasColumn('blog_questions', 'username');
  if (!hasUsername) {
    await knex.schema.alterTable('blog_questions', (table) => {
      table.string('username');
    });
    await knex('blog_questions')
      .update({ username: knex.raw("COALESCE(username, name)") });
    await knex.schema.alterTable('blog_questions', (table) => {
      table.dropColumn('name');
      table.string('username').notNullable().alter();
    });
  }
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (!hasTable) return;

  const hasName = await knex.schema.hasColumn('blog_questions', 'name');
  if (!hasName) {
    await knex.schema.alterTable('blog_questions', (table) => {
      table.string('name');
    });
    await knex('blog_questions')
      .update({ name: knex.raw("COALESCE(name, username)") });
    await knex.schema.alterTable('blog_questions', (table) => {
      table.dropColumn('username');
      table.string('name').notNullable().alter();
    });
  }
};
