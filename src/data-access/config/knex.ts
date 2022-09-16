import knex from "knex";
import dotenv from "dotenv";
import { convertToCamelCase, convertToSnakeCase } from "../../util/util";
dotenv.config();
const con = process.env.DB_CONN_STRING;
const config = {
  development: {
    client: "pg",
    connection: "postgres://omo:54321@localhost:5432/home_search",

    wrapIdentifier: (value: any, origImpl: any, queryContext: any) =>
      origImpl(convertToSnakeCase(value)),
    migrations: {
      tableName: "knex_migrations",
    },
    postProcessResponse: (result: any, queryContext: any) => {
      if (queryContext === "crud_functions") {
        if (Array.isArray(result)) {
          return result.map((row) => {
            return convertToCamelCase(row);
          });
        }
      }
      return result;
    },
  },
  production: {
    client: "pg",
    connection: con,

    wrapIdentifier: (value: any, origImpl: any, queryContext: any) =>
      origImpl(convertToSnakeCase(value)),
  },
  postProcessResponse: (result: any, queryContext: any) => {
    if (queryContext === "crud_functions") {
      if (Array.isArray(result)) {
        return result.map((row) => {
          return convertToCamelCase(row);
        });
      }
    }
    return result;
  },
};

module.exports = config["development"];
