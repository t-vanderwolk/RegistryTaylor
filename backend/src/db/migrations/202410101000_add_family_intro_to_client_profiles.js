exports.up = async (knex) => {
  const hasColumn = await knex.schema.hasColumn('client_profiles', 'family_intro');
  if (!hasColumn) {
    await knex.schema.alterTable('client_profiles', (table) => {
      table.text('family_intro');
    });
  }
};

exports.down = async (knex) => {
  const hasColumn = await knex.schema.hasColumn('client_profiles', 'family_intro');
  if (hasColumn) {
    await knex.schema.alterTable('client_profiles', (table) => {
      table.dropColumn('family_intro');
    });
  }
};
