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
import { genRandomId, getCryptoRandomId, responseObject } from "../util/util";

const userRepo: UserModel = new UserRepo(db);

export const addUser = async (user: UserObject) => {
  const isValidUser = validateUser(user);
  let res: Pick<UserObject, "id">[] = [];
  if (isValidUser.err !== undefined) {
    return responseObject({ err: isValidUser.err, data: null, success: false });
  }
  let { salt } = user;

  salt = getCryptoRandomId(16);
  const hash = crypto
    .pbkdf2Sync(user.password, salt, 1000, 64, "sha512")
    .toString("hex");
  user.id = await genRandomId();
  user.password = hash;
  user.salt = salt;
  res = await userRepo.addUser(user);

  if (res.length > 0) return responseObject({ data: res[0].id, success: true });
  return responseObject({
    err: "Something went wrong",
    success: false,
    data: null,
  });
};
export const loginHandler = async ({
  phoneNumber,
  password,
}: {
  phoneNumber: number;
  password: string;
}) => {
  const user: UserObject[] = await userRepo.getUserByNumber(phoneNumber);
  if (user.length === 0)
    return responseObject({
      success: false,
      err: "No user registered with this number",
      data: null,
    });
  const { salt, password: pwd, id } = user[0];
  if (!salt)
    return responseObject({
      err: "Something went wrong",
      success: false,
      data: null,
    });
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  if (hash !== pwd)
    return responseObject({
      err: "Password does not match",
      success: false,
      data: null,
    });

  const token = crypto.randomBytes(64).toString("hex");
  const result = await userRepo.addUserSession(id, token);
  if (result.length === 0)
    return responseObject({
      success: false,
      err: "There was an error logging in, please try again",
      data: null,
    });
  return responseObject({ success: true, data: token });
};

export const getUserById = async (id: string) => {
  const user: UserObject[] = await userRepo.getUserById(id);
  if (user.length === 0)
    return responseObject({
      err: "User not found",
      data: null,
      success: false,
    });

  return responseObject({ success: true, err: undefined, data: user[0] });
};
export const getUserFromSessionId = async (token: string) => {
  const user = await userRepo.getUserFromSessionId(token);
  if (user.length === 0)
    return responseObject({
      err: "User not found",
      data: null,
      success: false,
    });

  return responseObject({ success: true, data: user[0] });
};
export const deactivateUser = async (id: string) => {
  const user: Pick<UserObject, "id">[] = await userRepo.deactivateUser(id);
  if (user.length === 0)
    return responseObject({
      err: "There was an error deactivating the user",
      success: false,
      data: null,
    });
  const delSessions = await userRepo.deleteAllUserSessions(user[0]?.id);
  if (!delSessions)
    return responseObject({
      err: "No sessions for this user",
      success: false,
      data: null,
    });
  return responseObject({ success: true, data: "Sessions deleted successful" });
};
export const removeUser = async (id: string) => {
  const deleted = await userRepo.delUser(id);
  if (deleted)
    return responseObject({ success: true, data: "User successfully deleted" });
};

const validateUser = (user: UserObject): { err: string | undefined } => {
  //TODO validate user
  return { err: undefined };
};
