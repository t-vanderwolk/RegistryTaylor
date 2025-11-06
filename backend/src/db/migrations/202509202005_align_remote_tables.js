exports.up = async (knex) => {
  const createIfMissing = async (tableName, callback) => {
    const exists = await knex.schema.hasTable(tableName);
    if (!exists) {
      await knex.schema.createTable(tableName, callback);
    }
  };

  await createIfMissing('client_profiles', (table) => {
    table
      .uuid('user_id')
      .primary()
      .references('users.id')
      .onDelete('CASCADE');
    table.string('parent_one_name');
    table.string('parent_two_name');
    table.string('baby_name');
    table.string('baby_gender');
    table.date('due_date');
    table.string('package_choice');
    table.string('mentor_preference');
    table.timestamps(true, true);
  });

  await createIfMissing('mentor_profiles', (table) => {
    table
      .uuid('user_id')
      .primary()
      .references('users.id')
      .onDelete('CASCADE');
    table.string('specialty');
    table.text('bio');
    table.string('availability');
    table.integer('max_clients').defaultTo(5);
    table.jsonb('certifications').defaultTo('[]');
    table.timestamps(true, true);
  });

  await createIfMissing('mentor_assignments', (table) => {
    table.uuid('mentor_id').references('users.id').onDelete('CASCADE');
    table.uuid('client_id').references('users.id').onDelete('CASCADE');
    table.primary(['mentor_id', 'client_id']);
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  const dropIfExists = async (tableName) => {
    const exists = await knex.schema.hasTable(tableName);
    if (exists) {
      await knex.schema.dropTable(tableName);
    }
  };

  await dropIfExists('mentor_assignments');
  await dropIfExists('mentor_profiles');
  await dropIfExists('client_profiles');
};
