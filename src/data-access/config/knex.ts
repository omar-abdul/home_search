import knex from "knex";
import dotenv from "dotenv";
import { convertToCamelCase, convertToSnakeCase } from "../../lib/util";
import * as ConfigObj from '../../../config';


const con = ConfigObj.default.DB.connect
const db_name=ConfigObj.default.DB.name;
const config = {
  development: {
    client: 'pg',
    connection: {
      host : ConfigObj.default.DB.host,
      port : ConfigObj.default.DB.port||5432,
      user : ConfigObj.default.DB.user,
      password : ConfigObj.default.DB.password,
      database : ConfigObj.default.DB.name
    },

    wrapIdentifier: (value: any, origImpl: any, queryContext: any) =>
      origImpl(convertToSnakeCase(value)),
    migrations: {
      tableName: "knex_migration",
      directory:'../migrations'
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
