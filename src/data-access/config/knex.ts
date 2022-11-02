import knex from "knex";
import dotenv from "dotenv";
import { convertToCamelCase, convertToSnakeCase } from "../../lib/util";
import ConfigObj from "../../../config";

const con = ConfigObj.DB.connect;
const db_name = ConfigObj.DB.name;
const config = {
  development: {
    client: "pg",
    connection: {
      host: ConfigObj.DB.host,
      port: ConfigObj.DB.port || 5432,
      user: ConfigObj.DB.user,
      password: ConfigObj.DB.password,
      database: ConfigObj.DB.name,
    },

    wrapIdentifier: (value: any, origImpl: any, queryContext: any) =>
      origImpl(convertToSnakeCase(value)),
    migrations: {
      tableName: "knex_migration",
      directory: "../migrations",
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
    client: db_name,
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
