import { Server } from "http";
import { AddressInfo } from "net";
import express from "express";
import defaultRoutes from "../entry/routes";
import { errorHandler } from "@lib/error_handler";
import { CustomDatabaseError } from "@lib/customerrors";
let connection: Server;

async function startWebServer(): Promise<AddressInfo> {
  const expressApp = express();
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  defaultRoutes(expressApp);
  handleRouteErrors(expressApp);
  const ApiAddress = await openConnection(expressApp);
  return ApiAddress;
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const port = process.env.Port || 8080;
    connection = expressApp.listen(port, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

function handleRouteErrors(expressApp: express.Application) {
  expressApp.use(
    async (
      error: any,
      req: express.Request,
      res: express.Response,
      // Express requires next function in default error handlers

      next: express.NextFunction
    ) => {
      if (error && typeof error === "object") {
        if (error.isTrusted === undefined || error.isTrusted === null) {
          error.isTrusted = true; // Error during a specific request is usually not fatal and should not lead to process exit
        }
      }

      errorHandler.handleError(error);
      res
        .status(error?.statusCode || 500)
        .json({
          success: false,
          err:
            // error instanceof CustomDatabaseError
            //   ? "There was an internal error"
            error?.message,
          data: error,
        })
        .end();
    }
  );
}

export { startWebServer, stopWebServer };
