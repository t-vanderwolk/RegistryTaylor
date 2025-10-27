exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (!hasTable) return;

  const hasColumn = await knex.schema.hasColumn('blog_questions', 'assigned_to');
  if (!hasColumn) {
    await knex.schema.alterTable('blog_questions', (table) => {
      table.uuid('assigned_to').references('users.id').onDelete('SET NULL');
    });
  }
};

exports.down = async (knex) => {
  const hasTable = await knex.schema.hasTable('blog_questions');
  if (!hasTable) return;

  const hasColumn = await knex.schema.hasColumn('blog_questions', 'assigned_to');
  if (hasColumn) {
    await knex.schema.alterTable('blog_questions', (table) => {
      table.dropColumn('assigned_to');
    });
  }
};
