import express, { NextFunction, Response, Request } from "express";
import { passport } from "../data-access/config/passport";
import {
  addHome,
  getAllHomes,
  getHomeById,
} from "../controller/home_controller";
import { HomeObject } from "../data-access/repositories/home_model";
import { UserObject } from "../data-access/repositories/user_model";
const router = express.Router();

router.post(
  "/add-home",
  passport.authenticate("bearer", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    const home: HomeObject = req.body;

    const user = <UserObject>req.user;
    home.userId = user.id;
    try {
      const { data, err } = await addHome(home);
      if (err)
        //res.json({ success: false, err: err.message }).status(err.statusCode);
        throw err;
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/homes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, err } = await getAllHomes();
      if (err) throw err;
      else res.json({ data }).status(200);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/home/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const homeId: string = req.params.id;
      const { data, err } = await getHomeById(homeId);
      if (err)
        throw err; //res.json({ msg: err.messsage }).status(err.statusCode);
      else res.json({ data });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
