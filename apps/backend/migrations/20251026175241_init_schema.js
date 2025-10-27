export async function up(knex) {
  // Users & Roles
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.enu("role", ["member", "mentor", "admin"]).defaultTo("member");
    table.timestamps(true, true);
  });

  // Academy Journeys & Modules
  await knex.schema.createTable("academy_journeys", (table) => {
    table.increments("id").primary();
    table.string("slug").unique().notNullable();
    table.string("title").notNullable();
    table.text("description");
  });

  await knex.schema.createTable("academy_modules", (table) => {
    table.increments("id").primary();
    table
      .integer("journey_id")
      .unsigned()
      .references("id")
      .inTable("academy_journeys")
      .onDelete("CASCADE");
    table.string("title").notNullable();
    table.text("lecture");
    table.text("prompt");
    table.text("apply");
  });

  // Registry Items
  await knex.schema.createTable("registry_items", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("product_name").notNullable();
    table.string("brand");
    table.string("affiliate_link");
    table.boolean("purchased").defaultTo(false);
    table.timestamps(true, true);
  });

  // Community Posts
  await knex.schema.createTable("community_posts", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("title").notNullable();
    table.text("content");
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema
    .dropTableIfExists("community_posts")
    .dropTableIfExists("registry_items")
    .dropTableIfExists("academy_modules")
    .dropTableIfExists("academy_journeys")
    .dropTableIfExists("users");
}