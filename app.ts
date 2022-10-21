import { startWebServer } from "./src/entry/server";
import { logger } from "@lib/logger";
import { errorHandler } from "@lib/error_handler";

import mig from "./src/data-access/migrations/home_migrations";

async function start() {
  return Promise.all([startWebServer()]);
}
async function initDb() {
  return Promise.resolve(mig.up);
}
start()
  .then((connection) => {
    logger.info("Server has started successfully on  %o,", connection);
  })
  .catch((error) => {
    errorHandler.handleError(error);
  });
