import { Knex } from "knex";

const locations: string[] = [
  "Laascanod",
  "Burco",
  "Hargeisa",
  "Borama",
  "Ceerigabo",
];

export = {
  up: async (db: Knex) => {
    return CreateTables(db);
  },
  down: async (db: Knex) => {
    return await db.schema
      .dropTableIfExists("payments")
      .dropTableIfExists("homes_nearby_places")
      .dropTableIfExists("places")
      .dropTableIfExists("sessions")
      .dropTableIfExists("homes")
      .dropTableIfExists("users");
  },
};

async function CreateTables(db: Knex) {
  return await db.schema
    .createTable("users", (table) => {
      db.raw("CREATE EXTENSION IF NOT EXISTS 'uuid-ossp'");
      table.string("id").notNullable().unique();
      table.uuid("uuid").notNullable().defaultTo(db.raw("uuid_generate_v4()"));
      table.string("first_name").notNullable();
      table.string("middle_name");
      table.string("last_name");
      table.string("phone_number").unique().notNullable();
      table.text("user_name");
      table.string("profile_pic", 255);
      table.string("whatsapp_number");
      table.string("email").unique();
      table.string("password").notNullable();
      table.primary(["id", "uuid"]);
      table.string("salt").notNullable();
      table.boolean("active");
    })
    .createTable("homes", (table) => {
      db.raw("CREATE EXTENSION IF NOT EXISTS 'uuid-ossp'");
      table.string("id").notNullable();
      table
        .uuid("home_id")
        .notNullable()
        .defaultTo(db.raw("uuid_generate_v4()"))
        .unique();
      table.enu("type", ["Rent", "Sale"]);
      table.enu("location", locations);
      table.text("description");
      table.integer("room_numbers");
      table.decimal("price");
      table.geometry("coordinates");
      table.decimal("lat", null);
      table.decimal("lon", null);
      table
        .string("user_id")
        .references("id")
        .inTable("users")
        .onDelete("Cascade")
        .onUpdate("Cascade");
      table.primary(["id", "home_id"]);
      table
        .enu("status", [
          "active",
          "pending payment",
          "sold",
          "inactive",
          "not available",
        ])
        .defaultTo("inactive");
      table.dateTime("created_at").defaultTo(db.fn.now());
      table.boolean("is_paid").notNullable();
      table.json("images");
      table
        .enu("furnish", ["furnished", "not furnished"])
        .defaultTo("not furnished");
    })
    .createTable("sessions", (table) => {
      table.string("session_id").primary();
      table
        .string("user_id")
        .references("id")
        .inTable("users")
        .onDelete("Cascade")
        .onUpdate("Cascade");
      table.dateTime("created_at").defaultTo(db.fn.now(6));
      table
        .dateTime("expires_at")
        .defaultTo(db.raw(`?+ INTERVAL '? day' `, [db.fn.now(6), 30]));
      table.boolean("is_revoked").notNullable();
    })
    .createTable("places", (table) => {
      table.increments("id").primary();
      table.string("name");
      table.geometry("coordinates").notNullable();
    })
    .createTable("homes_nearby_places", (table) => {
      table.increments("id").primary();
      table
        .uuid("home_id")
        .references("home_id")
        .inTable("homes")
        .onDelete("Cascade")
        .onUpdate("Cascade");
      table
        .integer("location_id")
        .references("id")
        .inTable("places")
        .onDelete("Cascade")
        .onUpdate("Cascade");
      table.decimal("distance");
    })
    .createTable("payments", (table) => {
      db.raw("CREATE EXTENSION IF NOT EXISTS 'uuid-ossp'");
      table.string("uuid").defaultTo(db.raw("uuid_generate_v4()")).primary();
      table
        .uuid("home_id")
        .references("home_id")
        .inTable("homes")
        .onDelete("Cascade")
        .onUpdate("Cascade");
      table
        .string("user_id")
        .references("id")
        .inTable("users")
        .onDelete("Cascade")
        .onUpdate("Cascade");
      table.text("payment_description").notNullable();
      table.boolean("reversed");
      table.dateTime("created_at").defaultTo(db.fn.now()).notNullable();
    });
}
// async function createHomesTable(db: Knex) {
//   return await db.schema.createTable("homes", (table) => {
//     db.raw("CREATE EXTENSION IF NOT EXISTS 'uuid-ossp'");
//     table.string("id").notNullable();
//     table.uuid("home_id").notNullable().defaultTo(db.raw("uuid_generate_v4()"));
//     table.enu("type", ["Rent", "Sale"]);
//     table.enu("location", locations);
//     table.text("description");
//     table.integer("room_numbers");
//     table.decimal("price", null);
//     table.geometry("coordinates");
//     table
//       .string("user_id")
//       .references("id")
//       .inTable("users")
//       .onDelete("Cascade");
//     table.primary(["id", "home_id"]);
//   });
// }
// async function createLoggedIn(db: Knex) {
//   return await db.schema;
// }
