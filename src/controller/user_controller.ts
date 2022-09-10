/*
 *
 * User Controller Functions,
 * Business Logic with Regards to User
 *
 */

import crypto from "crypto";
import db from "../data-access/config/db";
import UserRepo from "../data-access/repositories/user_repository";
import { UserModel, UserObject } from "../data-access/repositories/user_model";
import { genRandomId } from "../util/util";

const userRepo: UserModel = new UserRepo(db);

export const addUser = async (user: UserObject) => {
  const isValidUser = validateUser(user);
  let res: Pick<UserObject, "id">[] = [];
  if (!isValidUser.err) {
    return { err: isValidUser.err };
  }
  let { id, salt, password } = user;
  id = await genRandomId();
  salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(user.password, salt, 1000, 64, "sha512")
    .toString("hex");
  password = hash;
  res = await userRepo.addUser(user);
  if (res.length > 0) return { err: undefined, data: res[0].id };
  return { err: "wrong" };
};
export const loginHandler = async ({
  phoneNumber,
  password,
}: {
  phoneNumber: number;
  password: string;
}) => {
  const user: UserObject[] = await userRepo.getUserByNumber(phoneNumber);
  if (user.length === 0) return { success: false, err: "user not found" };
  const { salt, password: pwd, id } = user[0];
  if (!salt) return { err: "Something went wrong" };
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  if (hash !== pwd)
    return {
      loggedIn: false,
      token: undefined,
      err: "Password Does not match",
    };

  const token = crypto.randomBytes(64).toString("hex");
  const result = await userRepo.addUserSession(id, token);
  if (result.length < 1)
    return {
      loggedIn: false,
      token: undefined,
      err: "There was an error logging in, please try again",
    };
  return { loggedIn: true, token };
};

const validateUser = (user: UserObject): { err: string | undefined } => {
  //TODO validate user
  return { err: undefined };
};
