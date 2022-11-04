import express, { NextFunction, Response, Request } from "express";
import multer, { Multer } from "multer";
import path from "path";

import { passport } from "../data-access/config/passport";
import {
  addHome,
  deactivateHome,
  getAllHomes,
  getHomeById,
  updateHome,
} from "../controller/home_controller";
import { HomeObject } from "../data-access/repositories/home_model";
import { UserObject } from "../data-access/repositories/user_model";
import { logger } from "@lib/logger";
import { passErrorToNext } from "@lib/util";
import { ValidationError } from "@lib/customerrors";

const router = express.Router();
const STATIC_FILES_PATH = path.join(path.resolve("./"), "public/tmp/uploads");
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, STATIC_FILES_PATH);
  },
  filename(req, file, cb) {
    const { originalname } = file;
    const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
    cb(null, `${file.fieldname}__${Date.now()}${fileExtension}`);
  },
});
let fileType: any;
const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const dynamicImport = new Function("specifier", "return import(specifier)"); //this imports esm modules and must be 'awaited';

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: CallableFunction
) => {
  if (!whitelist.includes(file.mimetype)) {
    (req as any).fileValid = false;
    return cb(null, false);
  }

  return cb(null, true);
};
const upload = multer({ storage, fileFilter });

router.post(
  "/add-home",

  passport.authenticate("bearer", { session: false }),
  upload.array("home_images", 5),
  async (req: Request, res: Response, next: NextFunction) => {
    //if ((req as any)?.fileValid === false)
    // return next(new ValidationError("Only image files are allowed"));
    const home: HomeObject = req.body;
    home.images = [];
    const files = req.files! as Express.Multer.File[];

    let fileType = await dynamicImport("file-type");
    let arr: [{}] = [{}];

    files.map(async (file) => {
      const meta = await fileType.fileTypeFromFile(file.path);
      if (!whitelist.includes(meta.mime)) {
        return next(new ValidationError("file is not allowed"));
      }
      return;
    });

    files.map(
      async (file) =>
        (home.images as [{}]).push({
          path: file.path,
          filename: file.filename,
        })
      // }
    );

    const user = <UserObject>req.user;
    home.userId = user.id;
    passErrorToNext(addHome(home), next).then((data) => {
      res.json({ data });
      logger.info(`Home with uuid ${JSON.stringify(data)} was added`);
    });
  }
);
router.get(
  "/homes",
  async (req: Request, res: Response, next: NextFunction) => {
    const obj = req.body;
    const { data, err } = await getAllHomes(obj);
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
    logger.info(`Home with uuid ${homeId} retrieved`);
  }
);

router.put("/home/deactivate", async (req, res, next) => {
  const { homeId } = req.body;
  const { data, err } = await deactivateHome(homeId);
  if (err) throw err;
  else
    res.json({ success: true, data: `Home ${homeId} deactivated` }).status(200);
  logger.info(`Home with uuid ${homeId} was deactived`);
});

router.put("home/update", async (req, res, next) => {
  const { id } = req.body;
  const home = (({ id, homeId, ...obj }) => obj)(req.body);
  const { data, err } = await updateHome(home, id);
  if (err) throw err;
  else
    res.json({ success: true, data: `Home updated successfuly` }).status(200);
});
export default router;
