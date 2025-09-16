/**
 * Initial Taylor-Made schema aligned with backend roadmap.
 */

exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table
      .enu('role', ['admin', 'member', 'mentor'], {
        useNative: true,
        enumName: 'user_role',
      })
      .notNullable()
      .defaultTo('member');
    table.string('password_hash');
    table
      .enu('invite_status', ['pending', 'approved', 'denied'], {
        useNative: true,
        enumName: 'invite_status',
      })
      .notNullable()
      .defaultTo('pending');
    table.boolean('nda_signed').notNullable().defaultTo(false);
    table.string('nda_document_id');
    table
      .enu('package_selected', ['essentials', 'signature', 'bespoke'], {
        useNative: true,
        enumName: 'membership_package_type',
      })
      .nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('invites', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email').notNullable().unique();
    table.string('name');
    table.string('invite_code').notNullable();
    table
      .enu('status', ['pending', 'claimed', 'expired'], {
        useNative: true,
        enumName: 'invite_code_status',
      })
      .notNullable()
      .defaultTo('pending');
    table.timestamp('expires_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('membership_packages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.decimal('price_pilot', 10, 2).notNullable();
    table.decimal('price_future', 10, 2).notNullable();
    table.jsonb('included_services').notNullable().defaultTo('[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('add_ons', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table
      .enu(
        'category',
        ['nursery', 'events', 'gear', 'lifestyle', 'postpartum'],
        { useNative: true, enumName: 'add_on_category' },
      )
      .notNullable();
    table.text('description').notNullable();
    table.decimal('price_pilot', 10, 2).notNullable();
    table.decimal('price_future', 10, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('blog_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.string('slug').notNullable().unique();
    table.text('content').notNullable();
    table
      .enu(
        'category',
        ['registry', 'nursery', 'gear', 'lifestyle', 'events', 'fourth_trimester'],
        { useNative: true, enumName: 'blog_category' },
      )
      .notNullable();
    table.uuid('author_id').references('id').inTable('users').onDelete('SET NULL');
    table
      .enu('visibility', ['public', 'members_only'], {
        useNative: true,
        enumName: 'post_visibility',
      })
      .notNullable()
      .defaultTo('public');
    table.timestamp('published_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('mentors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.text('profile').notNullable();
    table.jsonb('specialties').notNullable().defaultTo('[]');
    table.jsonb('availability').notNullable().defaultTo('[]');
    table
      .enu('status', ['active', 'pending', 'alum'], {
        useNative: true,
        enumName: 'mentor_status',
      })
      .notNullable()
      .defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('consultations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('member_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.uuid('consultant_id').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('date_time').notNullable();
    table.text('notes_encrypted');
    table
      .enu('status', ['scheduled', 'completed', 'cancelled'], {
        useNative: true,
        enumName: 'consultation_status',
      })
      .notNullable()
      .defaultTo('scheduled');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('documents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('file_url').notNullable();
    table
      .enu('document_type', ['nda', 'contract', 'plan'], {
        useNative: true,
        enumName: 'document_type',
      })
      .notNullable();
    table.timestamp('signed_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema
    .dropTableIfExists('documents')
    .dropTableIfExists('consultations')
    .dropTableIfExists('mentors')
    .dropTableIfExists('blog_posts')
    .dropTableIfExists('add_ons')
    .dropTableIfExists('membership_packages')
    .dropTableIfExists('invites')
    .dropTableIfExists('users');

  await knex.raw('DROP TYPE IF EXISTS document_type');
  await knex.raw('DROP TYPE IF EXISTS invite_code_status');
  await knex.raw('DROP TYPE IF EXISTS consultation_status');
  await knex.raw('DROP TYPE IF EXISTS mentor_status');
  await knex.raw('DROP TYPE IF EXISTS post_visibility');
  await knex.raw('DROP TYPE IF EXISTS blog_category');
  await knex.raw('DROP TYPE IF EXISTS add_on_category');
  await knex.raw('DROP TYPE IF EXISTS membership_package_type');
  await knex.raw('DROP TYPE IF EXISTS invite_status');
  await knex.raw('DROP TYPE IF EXISTS user_role');
};
