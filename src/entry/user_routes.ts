import express, { NextFunction, Request, Response } from "express";
import { loginHandler, updateUser } from "../controller/user_controller";
import { passport } from "../data-access/config/passport";
import { UserObject } from "../data-access/repositories/user_model";
import { logger } from "@lib/logger";
const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { phoneNumber, password }: { phoneNumber: number; password: string } =
    req.body;

    const { err, data } = await loginHandler({ phoneNumber, password });

    if (err) throw err; //res.json({ err: err.message }).status(err.statusCode);
    else res.json({ data });
    logger.info(`User with session_id ${data} logged in`);

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
export default router;
