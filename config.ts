import { config } from "dotenv";
import path from "path";
config({ path: path.join(__dirname, ".env") });
const { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } = process.env;
export default {
  DB: {
    name: PGDATABASE,
    // connect: process.env.DB_CONN_STRING,
    host: PGHOST,
    password: PGPASSWORD,
    port: PGPORT,
    user: PGUSER,
  },
};
