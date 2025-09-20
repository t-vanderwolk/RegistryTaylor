exports.up = async (knex) => {
  const usersTable = 'users';
  const inviteCodesTable = 'invite_codes';

  const ensureColumn = async (table, column, builderCallback) => {
    const exists = await knex.schema.hasColumn(table, column);
    if (!exists) {
      await knex.schema.alterTable(table, builderCallback);
    }
  };

  await ensureColumn(usersTable, 'active', (table) => {
    table.boolean('active').notNullable().defaultTo(true);
  });

  await ensureColumn(usersTable, 'phone', (table) => {
    table.string('phone');
  });

  await ensureColumn(usersTable, 'zip_code', (table) => {
    table.string('zip_code');
  });

  await ensureColumn(inviteCodesTable, 'metadata', (table) => {
    table.jsonb('metadata').defaultTo('{}');
  });

  const hasPrivateBlog = await knex.schema.hasTable('private_blog_posts');
  if (!hasPrivateBlog) {
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
  const hasPrivateBlog = await knex.schema.hasTable('private_blog_posts');
  if (hasPrivateBlog) {
    await knex.schema.dropTable('private_blog_posts');
  }

  const columnExists = async (table, column) => knex.schema.hasColumn(table, column);

  if (await columnExists('invite_codes', 'metadata')) {
    await knex.schema.alterTable('invite_codes', (table) => {
      table.dropColumn('metadata');
    });
  }

  if (await columnExists('users', 'zip_code')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('zip_code');
    });
  }

  if (await columnExists('users', 'phone')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('phone');
    });
  }

  if (await columnExists('users', 'active')) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('active');
    });
  }
};
