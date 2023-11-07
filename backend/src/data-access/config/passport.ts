import { Passport } from "passport";
import { Strategy } from "passport-http-bearer";
import { UserObject } from "../repositories/user_model";
import UserRepo from "../repositories/user_repository";
import db from "./db";

const User = new UserRepo(db);
const passport = new Passport();

const BearerStrategy = new Strategy(function (
  token: string,
  cb: CallableFunction
) {
  User.getUserFromSessionId(token)
    .then((rows) => {
      if (rows.length === 0) return cb(null, false);
      const user: UserObject = rows[0];
      return cb(null, user);
    })
    .catch((err) => {
      return cb(err);
    });
});

passport.use(BearerStrategy);

export { passport };
