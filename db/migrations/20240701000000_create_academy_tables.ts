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
    table.integer("order_idx").notNullable().defaultTo(0);
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
    table.integer("order_idx").notNullable().defaultTo(0);
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
    table.integer("order_idx").notNullable().defaultTo(0);
    table.integer("est_minutes").notNullable().defaultTo(30);
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
      .references("id")
      .inTable("modules")
      .onDelete("CASCADE")
      .unique();
    table.text("explore").notNullable();
    table.jsonb("lecture").notNullable();
    table.text("journal_prompt").notNullable();
    table.jsonb("apply").notNullable();
    table.timestamps(true, true);
    table.index(["module_id"], "idx_module_content_module");
  });

  await knex.schema.createTable("user_progress", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("user_id").notNullable();
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

  await knex.schema.createTable("affiliate_products", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("category").notNullable();
    table.text("brand").notNullable();
    table.text("name").notNullable();
    table.text("image_url");
    table.text("product_url").notNullable();
    table.decimal("price", 10, 2);
    table.boolean("active").notNullable().defaultTo(true);
    table.timestamps(true, true);
    table.unique(["brand", "name"], "uq_affiliate_products_brand_name");
  });

  await knex.schema.createTable("registry_items", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("user_id").notNullable();
    table
      .uuid("module_id")
      .references("id")
      .inTable("modules")
      .onDelete("SET NULL");
    table
      .uuid("affiliate_product_id")
      .references("id")
      .inTable("affiliate_products")
      .onDelete("SET NULL");
    table
      .enu("status", ["suggested", "added", "removed"], {
        useNative: true,
        enumName: "registry_status_enum",
      })
      .notNullable()
      .defaultTo("suggested");
    table.text("mentor_notes");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.index(["user_id", "status"], "idx_registry_items_user_status");
    table.unique(["user_id", "affiliate_product_id"], "uq_registry_user_product");
  });

  await knex.schema.createTable("community_posts", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("user_id").notNullable();
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
    table.text("user_id").notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.index(["post_id", "created_at"], "idx_comments_post_created");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("community_comments");
  await knex.schema.dropTableIfExists("community_posts");
  await knex.schema.dropTableIfExists("registry_items");
  await knex.schema.dropTableIfExists("affiliate_products");
  await knex.schema.dropTableIfExists("user_progress");
  await knex.schema.dropTableIfExists("module_content");
  await knex.schema.dropTableIfExists("modules");
  await knex.schema.dropTableIfExists("tracks");
  await knex.schema.dropTableIfExists("journeys");
  await knex.raw('DROP TYPE IF EXISTS "registry_status_enum"');
}
