import express from "express";
import { STATUS_CODES } from "http";
import { loginHandler } from "../controller/user_controller";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { phoneNumber, password }: { phoneNumber: number; password: string } =
    req.body;
  try {
    const { err, data } = await loginHandler({ phoneNumber, password });

    if (err) res.json({ err: err.message }).status(err.statusCode);
    else res.json({ data });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
