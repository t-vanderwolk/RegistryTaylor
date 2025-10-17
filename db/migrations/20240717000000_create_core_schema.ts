import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema
    .createTable("users", (t) => {
      t
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("gen_random_uuid()"));
      t.string("username").unique().notNullable();
      t.string("email").unique().notNullable();
      t.string("password_hash").notNullable();
      t.timestamps(true, true);
    })
    .createTable("invite_codes", (t) => {
      t
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("gen_random_uuid()"));
      t.string("code").unique().notNullable();
      t.string("created_by");
      t.boolean("is_active").defaultTo(true);
      t
        .uuid("used_by")
        .references("id")
        .inTable("users");
      t.timestamp("used_at");
      t.timestamp("expires_at");
      t.timestamps(true, true);
    })
    .createTable("invite_requests", (t) => {
      t
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("gen_random_uuid()"));
      t.string("email").notNullable();
      t
        .enu("status", ["pending", "approved", "rejected"])
        .defaultTo("pending");
      t.string("approved_code");
      t.timestamps(true, true);
    })
    .createTable("affiliate_products", (t) => {
      t
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("gen_random_uuid()"));
      t.string("category");
      t.string("brand");
      t.string("name");
      t.string("image_url");
      t.string("product_url");
      t.decimal("price", 10, 2);
      t.boolean("active").defaultTo(true);
      t.timestamps(true, true);
    })
    .createTable("registry_items", (t) => {
      t
        .uuid("id")
        .primary()
        .defaultTo(knex.raw("gen_random_uuid()"));
      t
        .uuid("user_id")
        .references("id")
        .inTable("users");
      t
        .uuid("affiliate_product_id")
        .references("id")
        .inTable("affiliate_products");
      t
        .enu("status", ["suggested", "added", "removed"])
        .defaultTo("suggested");
      t.text("mentor_notes");
      t.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists("registry_items")
    .dropTableIfExists("affiliate_products")
    .dropTableIfExists("invite_requests")
    .dropTableIfExists("invite_codes")
    .dropTableIfExists("users");
}
