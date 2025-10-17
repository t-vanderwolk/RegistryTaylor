exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('registry_items');
  if (exists) {
    return;
  }

  await knex.schema.createTable('registry_items', (table) => {
    table.increments('id').primary();
    table.string('user_id').notNullable().index();
    table.string('module_id').notNullable();
    table.string('category').notNullable();
    table.string('product_name').notNullable();
    table.string('brand');
    table.string('product_url');
    table.string('mentor_tag');
    table.timestamps(true, true);

    table.index(['module_id'], 'registry_items_module_id_idx');
    table.index(['category'], 'registry_items_category_idx');
  });
};

exports.down = async (knex) => {
  const exists = await knex.schema.hasTable('registry_items');
  if (exists) {
    await knex.schema.dropTable('registry_items');
  }
};
