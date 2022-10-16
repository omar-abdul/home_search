import express, { Express, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import defaultRoutes from "./src/entry/routes";
import { startWebServer } from "./src/entry/server";
import { logger } from "@lib/logger";
import { errorHandler } from "@lib/error_handler";

config();
// const app: Express = express();

// app.use(express.json());
// app.use(cors());

// defaultRoutes(app);
// app.get("/", (req: Request, res: Response) => {
//   res.send("is it working");
// });

// app.listen(port, () => {
//   console.log(`[Server] is running on port :[${port}]`);
// });

async function start() {
  return Promise.all([startWebServer()]);
}

start()
  .then((connection) => {
    logger.info('Server has started successfully on %o,' ,connection);
  })
  .catch((error) => {
    errorHandler.handleError(error);
  });
