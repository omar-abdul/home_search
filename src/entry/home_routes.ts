import express, { NextFunction, Response, Request } from "express";
import { passport } from "../data-access/config/passport";
import {
  addHome,
  getAllHomes,
  getHomeById,
} from "../controller/home_controller";
import { HomeObject } from "../data-access/repositories/home_model";
import { UserObject } from "../data-access/repositories/user_model";
import { logger } from "@lib/logger";
const router = express.Router();

router.post(
  "/add-home",
  passport.authenticate("bearer", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    const home: HomeObject = req.body;

    const user = <UserObject>req.user;
    home.userId = user.id;
    
      const { data, err } = await addHome(home);
      if (err)
        throw err;
      res.json({ data });
      logger.info(`Home with uuid ${home.home_id} was added`);

  }
);
router.get(
  "/homes",
  async (req: Request, res: Response, next: NextFunction) => {

      const { data, err } = await getAllHomes();
      if (err) throw err;
      else res.json({ data }).status(200);

  }
);

router.get(
  "/home/:id",
  async (req: Request, res: Response, next: NextFunction) => {

      const homeId: string = req.params.id;
      const { data, err } = await getHomeById(homeId);
      if (err)
        throw err; //res.json({ msg: err.messsage }).status(err.statusCode);
      else res.json({ data });

  }
);
export default router;
