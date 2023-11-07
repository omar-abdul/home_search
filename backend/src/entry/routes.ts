import express from "express";
import homeRouter from "./home_routes";
import userRouter from "./user_routes";
export default function defineRoutes(expressApp: express.Application) {
  expressApp.use("/user", userRouter);
  expressApp.use("/home", homeRouter);
}
