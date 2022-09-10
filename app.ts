import express, { Express, Request, Response } from "express";
import { config } from "dotenv";

config();
const app: Express = express();
const port = process.env.Port || 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("is it working");
});

app.listen(port, () => {
  console.log(`[Server] is running on port :[${port}]`);
});
