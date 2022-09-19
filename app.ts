import express, { Express, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import defaultRoutes from "./src/entry/routes";

config();
const app: Express = express();
const port = process.env.Port || 8080;

app.use(express.json());
app.use(cors());

defaultRoutes(app);
app.get("/", (req: Request, res: Response) => {
  res.send("is it working");
});

app.listen(port, () => {
  console.log(`[Server] is running on port :[${port}]`);
});
