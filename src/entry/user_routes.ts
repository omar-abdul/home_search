import express, { NextFunction, Request, Response } from "express";
import {
  addUser,
  loginHandler,
  updateUser,
} from "../controller/user_controller";
import { passport } from "../data-access/config/passport";
import { UserObject } from "../data-access/repositories/user_model";
import { logger } from "@lib/logger";
import { passErrorToNext } from "@lib/util";
const router = express.Router();

router.post("/register", async (req, res, next) => {
  const user: UserObject = req.body;
  passErrorToNext(addUser(user), next).then((data) => {
    res.json({ success: true, data }).status(200);
    logger.info(`user registerd with id ${data}`);
  });
});

router.post("/login", async (req, res, next) => {
  const { phoneNumber, password }: { phoneNumber: number; password: string } =
    req.body;

  passErrorToNext(loginHandler({ phoneNumber, password }), next).then(
    (data) => {
      res.json({ data });
      logger.info(`User with session_id ${data} logged in`);
    }
  );
});

router.post(
  "/edit/profile",
  passport.authenticate("bearer", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    let user: UserObject, profileData: UserObject;
    if (req.user && req.body) {
      user = <UserObject>req.user;
      profileData = <UserObject>req.body;
    }
    const result = await updateUser(user!.id, profileData!);
    res.json(result).status(200);
    logger.info(`User with id ${result} updated`);
  }
);
router.get("/", (req, res, next) => {
  res.send("this is freaking working");
});
export default router;
