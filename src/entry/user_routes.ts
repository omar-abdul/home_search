import express, { NextFunction, Request, Response } from "express";
import {
  addUser,
  getUserById,
  getUserFromSessionId,
  loginHandler,
  removeUser,
  updateUser,
} from "../controller/user_controller";
import { passport } from "../data-access/config/passport";
import { UserObject } from "../data-access/repositories/user_model";
import { logger } from "@lib/logger";
import { passErrorToNext } from "@lib/util";
const router = express.Router();

router.post("/register", async (req, res, next) => {
  const user: UserObject = req.body;
  const { phoneNumber, password } = user;
  passErrorToNext(addUser(user), next).then((data) => {
    if (data) {
      passErrorToNext(loginHandler({ phoneNumber, password }), next).then(
        (token) => {
          if (token) {
            res.json({ success: true, data: token }).status(200);
            logger.info(`user registerd with id ${data}`);
          }
        }
      );
    }
  });
});

router.post("/login", async (req, res, next) => {
  const { phoneNumber, password }: { phoneNumber: string; password: string } =
    req.body;

  passErrorToNext(loginHandler({ phoneNumber, password }), next).then(
    (data) => {
      if (data) {
        res.json({ success: true, data });
        logger.info(`User with session_id ${data} logged in`);
      }
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
    const result = await passErrorToNext(
      updateUser(user!.id, profileData!),
      next
    );
    if (result) {
      res.json({ success: true, data: result }).status(200);
      logger.info(`User with id ${result} updated`);
    }
  }
);
router.get(
  "/me",
  passport.authenticate("bearer", { session: false }),
  async (req, res, next) => {
    const sessionId = req.headers.authorization!.split(" ")[1];
    const result = await passErrorToNext(getUserFromSessionId(sessionId), next);

    if (result) {
      res.json({ success: true, data: result });
    }
  }
);

router.delete(
  "/profile/delete",
  passport.authenticate("bearer", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = <UserObject>req.user;
    const result = await passErrorToNext(removeUser(user.id), next);
    if (result) {
      res.json({ success: true, data: result });
    }
  }
);
export default router;
