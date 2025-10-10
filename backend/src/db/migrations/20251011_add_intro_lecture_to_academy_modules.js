exports.up = async (knex) => {
  const hasIntroduction = await knex.schema.hasColumn('academy_modules', 'introduction');
  const hasLecture = await knex.schema.hasColumn('academy_modules', 'lecture');

  if (!hasIntroduction || !hasLecture) {
    await knex.schema.alterTable('academy_modules', (table) => {
      if (!hasIntroduction) {
        table.text('introduction');
      }
      if (!hasLecture) {
        table.text('lecture');
      }
    });
  }
};

exports.down = async (knex) => {
  const hasIntroduction = await knex.schema.hasColumn('academy_modules', 'introduction');
  const hasLecture = await knex.schema.hasColumn('academy_modules', 'lecture');

  if (hasIntroduction || hasLecture) {
    await knex.schema.alterTable('academy_modules', (table) => {
      if (hasIntroduction) {
        table.dropColumn('introduction');
      }
      if (hasLecture) {
        table.dropColumn('lecture');
      }
    });
  }
};
