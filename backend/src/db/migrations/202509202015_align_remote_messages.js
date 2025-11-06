exports.up = async (knex) => {
  const hasMessages = await knex.schema.hasTable('messages');
  if (!hasMessages) {
    await knex.schema.createTable('messages', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('thread_id').notNullable().references('users.id').onDelete('CASCADE');
      table.uuid('sender_id').notNullable().references('users.id').onDelete('CASCADE');
      table.text('body').notNullable();
      table.boolean('read').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
};

exports.down = async (knex) => {
  const hasMessages = await knex.schema.hasTable('messages');
  if (hasMessages) {
    await knex.schema.dropTable('messages');
  }
};
