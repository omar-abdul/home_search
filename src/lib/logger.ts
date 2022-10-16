import * as winston from "winston";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  format: winston.format.combine(winston.format.splat(), winston.format.json(), )
});

export { logger };
