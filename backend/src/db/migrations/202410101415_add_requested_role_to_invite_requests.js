exports.up = async (knex) => {
  const hasColumn = await knex.schema.hasColumn('invite_requests', 'requested_role');
  if (!hasColumn) {
    await knex.schema.alterTable('invite_requests', (table) => {
      table
        .enu('requested_role', ['client', 'mentor'], {
          useNative: true,
          enumName: 'invite_request_role',
        })
        .notNullable()
        .defaultTo('client');
    });
  }
};

exports.down = async (knex) => {
  const hasColumn = await knex.schema.hasColumn('invite_requests', 'requested_role');
  if (hasColumn) {
    await knex.schema.alterTable('invite_requests', (table) => {
      table.dropColumn('requested_role');
    });
  }
  await knex.raw('DROP TYPE IF EXISTS invite_request_role');
};
