exports.up = async (knex) => {
  await knex.schema.createTable('academy_modules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('slug').notNullable().unique();
    table.string('title').notNullable();
    table.string('subtitle');
    table
      .enu('category', ['foundations', 'nursery', 'gear', 'postpartum', 'community'], {
        useNative: true,
        enumName: 'academy_module_category',
      })
      .notNullable()
      .defaultTo('foundations');
    table.boolean('is_core').notNullable().defaultTo(true);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.integer('estimated_minutes').notNullable().defaultTo(20);
    table.string('registry_focus');
    table.text('overview').notNullable();
    table.text('lecture_content').notNullable();
    table.text('journal_prompt').notNullable();
    table
      .jsonb('apply_checklist')
      .notNullable()
      .defaultTo(knex.raw("'[]'::jsonb"));
    table.timestamps(true, true);
  });

  await knex.schema.createTable('academy_progress', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
    table.uuid('module_id').notNullable().references('academy_modules.id').onDelete('CASCADE');
    table.boolean('explore_completed').notNullable().defaultTo(false);
    table.boolean('lecture_completed').notNullable().defaultTo(false);
    table.boolean('apply_completed').notNullable().defaultTo(false);
    table.text('journal_entry');
    table.timestamp('journal_updated_at');
    table
      .jsonb('checklist_state')
      .notNullable()
      .defaultTo(knex.raw("'[]'::jsonb"));
    table.integer('percent_complete').notNullable().defaultTo(0);
    table.boolean('completed').notNullable().defaultTo(false);
    table.timestamp('completed_at');
    table.timestamp('last_viewed_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'module_id']);
    table.timestamps(true, true);
  });

  await knex.raw("CREATE TYPE registry_item_status AS ENUM ('wishlist', 'shortlist', 'ordered', 'arriving', 'fulfilled')");

  await knex.schema.createTable('registry_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE');
    table.string('product_id');
    table.string('title').notNullable();
    table.string('brand');
    table.string('category');
    table.text('image_url');
    table.text('affiliate_url');
    table.integer('price_cents');
    table.integer('quantity').notNullable().defaultTo(1);
    table
      .enu('status', null, {
        useNative: true,
        enumName: 'registry_item_status',
      })
      .notNullable()
      .defaultTo('wishlist');
    table.text('mentor_notes');
    table
      .jsonb('metadata')
      .notNullable()
      .defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
    table.index(['user_id', 'category']);
  });

  await knex.schema.createTable('registry_suggestions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('module_id').references('academy_modules.id').onDelete('SET NULL');
    table.string('product_id').unique();
    table.string('title').notNullable();
    table.string('brand');
    table.string('category');
    table.text('image_url');
    table.text('affiliate_url');
    table.integer('price_cents');
    table
      .jsonb('metadata')
      .notNullable()
      .defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
    table.index(['module_id', 'category']);
  });

  await knex.schema.createTable('community_events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.text('description');
    table
      .enu('event_type', ['salon', 'workshop', 'office_hours', 'celebration'], {
        useNative: true,
        enumName: 'community_event_type',
      })
      .notNullable()
      .defaultTo('salon');
    table.timestamp('starts_at').notNullable();
    table.timestamp('ends_at');
    table.string('location');
    table
      .jsonb('metadata')
      .notNullable()
      .defaultTo(knex.raw("'{}'::jsonb"));
    table.boolean('virtual').notNullable().defaultTo(true);
    table.boolean('featured').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.index(['starts_at', 'event_type']);
  });

  await knex.schema.alterTable('client_profiles', (table) => {
    table.boolean('mentor_eligible').notNullable().defaultTo(false);
    table.timestamp('mentor_eligible_at');
    table.integer('core_modules_completed').notNullable().defaultTo(0);
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('client_profiles', (table) => {
    table.dropColumn('mentor_eligible');
    table.dropColumn('mentor_eligible_at');
    table.dropColumn('core_modules_completed');
  });

  await knex.schema.dropTableIfExists('community_events');
  await knex.raw('DROP TYPE IF EXISTS community_event_type');

  await knex.schema.dropTableIfExists('registry_suggestions');
  await knex.schema.dropTableIfExists('registry_items');
  await knex.raw('DROP TYPE IF EXISTS registry_item_status');

  await knex.schema.dropTableIfExists('academy_progress');
  await knex.schema.dropTableIfExists('academy_modules');
  await knex.raw('DROP TYPE IF EXISTS academy_module_category');
};
