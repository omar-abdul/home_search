import express, { NextFunction, Request, Response } from "express";
import { loginHandler, updateUser } from "../controller/user_controller";
import { passport } from "../data-access/config/passport";
import { UserObject } from "../data-access/repositories/user_model";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { phoneNumber, password }: { phoneNumber: number; password: string } =
    req.body;
  try {
    const { err, data } = await loginHandler({ phoneNumber, password });

    if (err) throw err; //res.json({ err: err.message }).status(err.statusCode);
    else res.json({ data });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/edit/profile",
  passport.authenticate("bearer", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user: UserObject, profileData: UserObject;
      if (req.user && req.body) {
        user = <UserObject>req.user;
        profileData = <UserObject>req.body;
      }
      const result = await updateUser(user!.id, profileData!);
      res.json(result).status(200);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
