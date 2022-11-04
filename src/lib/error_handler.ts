import { logger } from "@lib/logger";
import { BaseError } from "@lib/customerrors";
import * as Http from "http";
import * as util from "util";
let httpServerRef: Http.Server;
const errorHandler = {
  listenToErrorEvents: (httpServer: Http.Server) => {
    httpServerRef = httpServer;
    process.on("uncaughtException", async (error) => {
      errorHandler.handleError(error);
    });
    process.on("unhandledRejection", async (error) => {
      errorHandler.handleError(error);
    });
    process.on("SIGTERM", async () => {
      logger.error("App received Sigterm event, Closing the server....");
      await terminateHttpServer();
    });
    process.on("SIGINT", async () => {
      logger.error("App received SIGINT event, Closing the server....");
      await terminateHttpServer();
    });
  },

  handleError: (errortoHandle: unknown) => {
    try {
      const appError: BaseError = normalizeError(errortoHandle);

      logger.error(appError.message);
      // console.log(appError.isTrusted);
      if (!appError.isTrusted) {
        terminateHttpServer();
      }
      return;
    } catch (handlingError: unknown) {
      process.stdout.write(
        "The error handler failed, here are the handler failure and then the origin error that it tried to handle"
      );
      process.stdout.write(JSON.stringify(handlingError));
      process.stdout.write(JSON.stringify(errortoHandle));
    }
  },
};

const terminateHttpServer = async () => {
  if (httpServerRef) {
    httpServerRef.close();
  }
  process.exit();
};

const normalizeError = (errortoHandle: unknown): BaseError => {
  if (errortoHandle instanceof BaseError) return errortoHandle;
  return new BaseError(
    `Error Handler received a none error instance with value - ${util.inspect(
      errortoHandle
    )}`,
    500,
    true
  );
};

export { errorHandler };
