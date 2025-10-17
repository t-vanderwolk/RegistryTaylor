exports.up = async (knex) => {
  const hasPosts = await knex.schema.hasTable('community_posts');
  if (!hasPosts) {
    await knex.schema.createTable('community_posts', (table) => {
      table.increments('id').primary();
      table.string('user_id').notNullable().index();
      table.string('module_slug').notNullable().index();
      table.text('content').notNullable();
      table.string('media_url');
      table.text('mentor_reply');
      table.timestamps(true, true);
    });
  }

  const hasReplies = await knex.schema.hasTable('community_replies');
  if (!hasReplies) {
    await knex.schema.createTable('community_replies', (table) => {
      table.increments('id').primary();
      table
        .integer('post_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('community_posts')
        .onDelete('CASCADE')
        .index();
      table.string('user_id').notNullable().index();
      table.text('content').notNullable();
      table.timestamps(true, true);
    });
  }
};

exports.down = async (knex) => {
  const hasReplies = await knex.schema.hasTable('community_replies');
  if (hasReplies) {
    await knex.schema.dropTable('community_replies');
  }

  const hasPosts = await knex.schema.hasTable('community_posts');
  if (hasPosts) {
    await knex.schema.dropTable('community_posts');
  }
};
