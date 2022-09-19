import express, { NextFunction, Response } from "express";
import { passport } from "../data-access/config/passport";
import { addHome } from "../controller/home_controller";
import { HomeObject } from "../data-access/repositories/home_model";
import { UserObject } from "../data-access/repositories/user_model";
import { AuthenticatedReq } from "../interfaces/AuthenticatedReq";
const router = express.Router();

router.post(
  "/add-home",
  passport.authenticate("bearer", { session: false }),
  async (req: AuthenticatedReq, res: Response, next: NextFunction) => {
    const home: HomeObject = req.body;
    if (req.user) home.userId = req.user.id;
    try {
      const { data, err } = await addHome(home);
      if (err)
        res.json({ success: false, err: err.message }).status(err.statusCode);
      res.json({ data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
