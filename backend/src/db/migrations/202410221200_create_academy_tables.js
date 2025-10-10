exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'academy_visibility') THEN
        CREATE TYPE academy_visibility AS ENUM ('client', 'mentor', 'all');
      END IF;
    END
    $$;
  `);

  const hasModulesTable = await knex.schema.hasTable('academy_modules');

  if (!hasModulesTable) {
    await knex.schema.createTable('academy_modules', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.text('title').notNullable();
      table.text('section').notNullable();
      table
        .enu('visible_to', ['client', 'mentor', 'all'], {
          useNative: true,
          enumName: 'academy_visibility',
          existingType: true,
        })
        .notNullable()
        .defaultTo('all');
      table.jsonb('content').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
      table.integer('order_index').notNullable().defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  } else {
    const ensureColumn = async (column, callback) => {
      const exists = await knex.schema.hasColumn('academy_modules', column);
      if (!exists) {
        await knex.schema.alterTable('academy_modules', callback);
      }
    };

    await ensureColumn('visible_to', (table) =>
      table
        .enu('visible_to', ['client', 'mentor', 'all'], {
          useNative: true,
          enumName: 'academy_visibility',
          existingType: true,
        })
        .notNullable()
        .defaultTo('all')
    );
    await ensureColumn('content', (table) => table.jsonb('content').notNullable().defaultTo(knex.raw("'{}'::jsonb")));
    await ensureColumn('order_index', (table) => table.integer('order_index').notNullable().defaultTo(0));
    await ensureColumn('created_at', (table) => table.timestamp('created_at').defaultTo(knex.fn.now()));
    await ensureColumn('updated_at', (table) => table.timestamp('updated_at').defaultTo(knex.fn.now()));
  }

  const hasWorkbookTable = await knex.schema.hasTable('workbook_entries');

  if (!hasWorkbookTable) {
    await knex.schema.createTable('workbook_entries', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
      table.uuid('module_id').notNullable().references('academy_modules.id').onDelete('CASCADE');
      table.text('prompt').notNullable();
      table.text('response');
      table.text('mentor_feedback');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.unique(['user_id', 'module_id', 'prompt']);
      table.index(['module_id', 'user_id']);
    });
  } else {
    const ensureColumn = async (column, callback) => {
      const exists = await knex.schema.hasColumn('workbook_entries', column);
      if (!exists) {
        await knex.schema.alterTable('workbook_entries', callback);
      }
    };

    await ensureColumn('mentor_feedback', (table) => table.text('mentor_feedback'));
    await ensureColumn('created_at', (table) => table.timestamp('created_at').defaultTo(knex.fn.now()));
    await ensureColumn('updated_at', (table) => table.timestamp('updated_at').defaultTo(knex.fn.now()));
  }
};

exports.down = async (knex) => {
  const hasWorkbookTable = await knex.schema.hasTable('workbook_entries');
  if (hasWorkbookTable) {
    await knex.schema.dropTable('workbook_entries');
  }

  const hasModulesTable = await knex.schema.hasTable('academy_modules');
  if (hasModulesTable) {
    await knex.schema.dropTable('academy_modules');
  }

  await knex.raw(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'academy_visibility') THEN
        DROP TYPE academy_visibility;
      END IF;
    END
    $$;
  `);
};
