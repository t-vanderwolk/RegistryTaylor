import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable("journeys", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("slug").notNullable().unique();
    table.text("title").notNullable();
    table.integer("order_idx").defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("tracks", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("journey_id")
      .notNullable()
      .references("id")
      .inTable("journeys")
      .onDelete("CASCADE");
    table.text("slug").notNullable().unique();
    table.text("title").notNullable();
    table.integer("order_idx").defaultTo(0);
    table.timestamps(true, true);
    table.index(["journey_id", "order_idx"], "idx_tracks_journey_order");
  });

  await knex.schema.createTable("modules", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("track_id")
      .notNullable()
      .references("id")
      .inTable("tracks")
      .onDelete("CASCADE");
    table.text("code").notNullable().unique();
    table.text("title").notNullable();
    table.text("subtitle");
    table.integer("order_idx").defaultTo(0);
    table.integer("est_minutes").defaultTo(30);
    table.text("cover_icon");
    table.timestamps(true, true);
    table.index(["track_id", "order_idx"], "idx_modules_track_order");
  });

  await knex.schema.createTable("module_content", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("module_id")
      .notNullable()
      .unique()
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE");
    table.text("explore").notNullable();
    table.jsonb("lecture").notNullable();
    table.text("journal_prompt").notNullable();
    table.jsonb("apply").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("user_progress", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("module_id")
      .notNullable()
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE");
    table.boolean("completed").notNullable().defaultTo(false);
    table.jsonb("checklist_state").defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
    table.index(["user_id", "module_id"], "idx_user_progress_user_module");
  });

  await knex.schema.createTable("community_posts", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("category").notNullable();
    table.text("title").notNullable();
    table.text("content").notNullable();
    table.text("image_url");
    table.boolean("is_anonymous").notNullable().defaultTo(false);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.index(["category", "created_at"], "idx_community_posts_category_created");
  });

  await knex.schema.createTable("community_comments", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("post_id")
      .notNullable()
      .references("id")
      .inTable("community_posts")
      .onDelete("CASCADE");
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.index(["post_id", "created_at"], "idx_comments_post_created");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("community_comments");
  await knex.schema.dropTableIfExists("community_posts");
  await knex.schema.dropTableIfExists("user_progress");
  await knex.schema.dropTableIfExists("module_content");
  await knex.schema.dropTableIfExists("modules");
  await knex.schema.dropTableIfExists("tracks");
  await knex.schema.dropTableIfExists("journeys");
}
