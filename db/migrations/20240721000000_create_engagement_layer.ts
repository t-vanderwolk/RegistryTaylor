import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reflections", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("user_id").notNullable();
    table.text("module_code").notNullable();
    table.text("content").notNullable();
    table.boolean("is_shared").notNullable().defaultTo(false);
    table.boolean("is_anonymous").notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.index(["user_id", "module_code"], "idx_reflections_user_module");
  });

  await knex.schema.createTable("reflection_shares", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("reflection_id")
      .notNullable()
      .references("id")
      .inTable("reflections")
      .onDelete("CASCADE");
    table
      .uuid("post_id")
      .notNullable()
      .references("id")
      .inTable("community_posts")
      .onDelete("CASCADE");
    table.timestamp("shared_at").notNullable().defaultTo(knex.fn.now());
    table.unique(["reflection_id", "post_id"], "uq_reflection_shares_reflection_post");
  });

  await knex.schema.createTable("mentor_feedback", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("reflection_id")
      .notNullable()
      .references("id")
      .inTable("reflections")
      .onDelete("CASCADE");
    table.text("mentor_id").notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("achievements", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("code").notNullable().unique();
    table.text("title").notNullable();
    table.text("description").notNullable();
    table.text("icon_svg").notNullable();
  });

  await knex.schema.createTable("user_achievements", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("user_id").notNullable();
    table
      .text("achievement_code")
      .notNullable()
      .references("code")
      .inTable("achievements")
      .onDelete("CASCADE");
    table.timestamp("awarded_at").notNullable().defaultTo(knex.fn.now());
    table.unique(["user_id", "achievement_code"], "uq_user_achievements_user_code");
    table.index(["user_id"], "idx_user_achievements_user");
  });

  await knex.schema.createTable("insight_registry_map", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.text("module_code").notNullable();
    table.integer("slide_idx").notNullable();
    table.specificType("categories", "text[]").notNullable();
    table.unique(["module_code", "slide_idx"], "uq_insight_registry_module_slide");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("insight_registry_map");
  await knex.schema.dropTableIfExists("user_achievements");
  await knex.schema.dropTableIfExists("achievements");
  await knex.schema.dropTableIfExists("mentor_feedback");
  await knex.schema.dropTableIfExists("reflection_shares");
  await knex.schema.dropTableIfExists("reflections");
}
