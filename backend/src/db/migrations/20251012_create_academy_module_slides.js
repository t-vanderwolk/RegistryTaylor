exports.up = async (knex) => {
  const tableExists = await knex.schema.hasTable('academy_module_slides');

  if (!tableExists) {
    await knex.schema.createTable('academy_module_slides', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('module_slug').notNullable();
      table.string('module_title').notNullable();
      table.string('journey').notNullable();
      table.integer('slide_number').notNullable();
      table.string('slide_type').notNullable();
      table.string('title').notNullable();
      table.text('content').notNullable();
      table.timestamps(true, true);
      table.unique(['module_slug', 'slide_number']);
      table.index(['module_slug']);
    });
  }

  const hasSlugColumn = await knex.schema.hasColumn('academy_modules', 'slug');
  if (!hasSlugColumn) {
    await knex.schema.alterTable('academy_modules', (table) => {
      table.string('slug').unique();
    });
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('academy_module_slides');

  const hasSlugColumn = await knex.schema.hasColumn('academy_modules', 'slug');
  if (hasSlugColumn) {
    await knex.schema.alterTable('academy_modules', (table) => {
      table.dropColumn('slug');
    });
  }
};
