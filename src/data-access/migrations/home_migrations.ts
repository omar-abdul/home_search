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
      .dropTableIfExists("homes")
      .dropTableIfExists("sessions")
      .dropTableIfExists("users");
  },
};

async function CreateTables(db: Knex) {
  return await db.schema
    .createTable("users", (table) => {
      db.raw("CREATE EXTENSION IF NOT EXISTS 'uuid-ossp'");
      table.string("id").notNullable().unique();
      table.uuid("uuid").notNullable().defaultTo(db.raw("uuid_generate_v4()"));
      table.string("first_name");
      table.string("middle_name");
      table.string("last_name");
      table.integer("phone_number").unique;
      table.text("user_name").unique;
      table.string("profile_pic", 255);
      table.integer("whatsapp_number");
      table.string("email").unique();
      table.string("password").notNullable();
      table.primary(["id", "uuid"]);
      table.string("salt").notNullable();
    })
    .createTable("homes", (table) => {
      db.raw("CREATE EXTENSION IF NOT EXISTS 'uuid-ossp'");
      table.string("id").notNullable();
      table
        .uuid("home_id")
        .notNullable()
        .defaultTo(db.raw("uuid_generate_v4()"));
      table.enu("type", ["Rent", "Sale"]);
      table.enu("location", locations);
      table.text("description");
      table.integer("room_numbers");
      table.decimal("price", null);
      table.geometry("coordinates");
      table
        .string("user_id")
        .references("id")
        .inTable("users")
        .onDelete("Cascade");
      table.primary(["id", "home_id"]);
    })
    .createTable("sessions", (table) => {
      table.string("session_id").primary();
      table
        .string("user_id")
        .references("id")
        .inTable("users")
        .onDelete("Cascade");
      table.dateTime("created_at").defaultTo(db.fn.now(6));
      table.boolean("is_revoked").notNullable();
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
