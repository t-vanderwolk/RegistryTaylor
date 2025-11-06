exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table
      .enu('role', ['admin', 'mentor', 'client'], {
        useNative: true,
        enumName: 'user_portal_role',
      })
      .notNullable();
    table.string('phone');
    table.string('zip_code');
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('invite_codes', (table) => {
    table.string('code').primary();
    table
      .enu('role', ['admin', 'mentor', 'client'], {
        useNative: true,
        enumName: 'invite_portal_role',
      })
      .notNullable();
    table.string('assigned_name');
    table.string('assigned_email');
    table.timestamp('expires_at');
    table.boolean('single_use').notNullable().defaultTo(true);
    table.timestamp('used_at');
    table.uuid('used_by_user_id').references('users.id').onDelete('SET NULL');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('client_profiles', (table) => {
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

  await knex.schema.createTable('mentor_profiles', (table) => {
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

  await knex.schema.createTable('mentor_assignments', (table) => {
    table.uuid('mentor_id').references('users.id').onDelete('CASCADE');
    table.uuid('client_id').references('users.id').onDelete('CASCADE');
    table.primary(['mentor_id', 'client_id']);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('thread_id').notNullable().references('users.id').onDelete('CASCADE');
    table.uuid('sender_id').notNullable().references('users.id').onDelete('CASCADE');
    table.text('body').notNullable();
    table.boolean('read').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('private_blog_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.string('category').notNullable();
    table.text('content').notNullable();
    table.uuid('author_id').references('users.id').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema
    .dropTableIfExists('private_blog_posts')
    .dropTableIfExists('messages')
    .dropTableIfExists('mentor_assignments')
    .dropTableIfExists('mentor_profiles')
    .dropTableIfExists('client_profiles')
    .dropTableIfExists('invite_codes')
    .dropTableIfExists('users');

  await knex.raw('DROP TYPE IF EXISTS invite_portal_role');
  await knex.raw('DROP TYPE IF EXISTS user_portal_role');
};
exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('private_blog_posts');
  if (!exists) {
    await knex.schema.createTable('private_blog_posts', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('title').notNullable();
      table.string('category').notNullable();
      table.text('content').notNullable();
      table.uuid('author_id').references('users.id').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('private_blog_posts');
};
