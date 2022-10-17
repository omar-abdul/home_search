import { config } from "dotenv";
config();
const {PG_DATABASE,PG_HOST,PG_PASSWORD,PG_PORT,PG_USER}=process.env;
export default  {
  DB: {
    name:PG_DATABASE,
    connect:process.env.DB_CONN_STRING,
    host:PG_HOST,
    password:PG_PASSWORD,
    port:PG_PORT,
    user:PG_USER
  },
};
