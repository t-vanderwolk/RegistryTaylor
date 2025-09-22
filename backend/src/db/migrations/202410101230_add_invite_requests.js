exports.up = async (knex) => {
  const hasTable = await knex.schema.hasTable('invite_requests');
  if (!hasTable) {
    await knex.schema.createTable('invite_requests', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('zip_code');
      table.string('package_choice');
      table
        .enu('status', ['pending', 'approved', 'declined'], {
          useNative: true,
          enumName: 'invite_request_status',
        })
        .notNullable()
        .defaultTo('pending');
      table.string('generated_code');
      table.uuid('handled_by').references('users.id').onDelete('SET NULL');
      table.timestamp('handled_at');
      table.text('notes');
      table.timestamps(true, true);
    });
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('invite_requests');
  await knex.raw('DROP TYPE IF EXISTS invite_request_status');
};
