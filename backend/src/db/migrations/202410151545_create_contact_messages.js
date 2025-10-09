exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('contact_messages');
  if (!exists) {
    await knex.schema.createTable('contact_messages', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('phone');
      table.string('due_date');
      table.text('message').notNullable();
      table.timestamps(true, true);
    });
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('contact_messages');
};
