/*
*
*
Singleton Db Object
*
*
*/

import knex from "knex";
import * as config from "./knex";
export default knex(config);
