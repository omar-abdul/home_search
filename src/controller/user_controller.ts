/*
 *
 * User Controller Functions,
 * Business Logic with Regards to User
 *
 */

import crypto, { BinaryLike } from "crypto";
import db from "../data-access/config/db";
import UserRepo from "../data-access/repositories/user_repository";
import { UserModel, UserObject } from "../data-access/repositories/user_model";
import { genRandomId, getCryptoRandomId, responseObject } from "../lib/util";
import {
  LoginFailureError,
  ResourceNotFoundError,
  ValidationError,
} from "@lib/customerrors";

const userRepo: UserModel = new UserRepo(db);

export const addUser = async (user: UserObject) => {
  try {
    const isValidUser = validateUser(user);
    let res: Pick<UserObject, "id">[];
    if (isValidUser.err !== null) {
      return responseObject({
        err: new ValidationError(isValidUser.err),
        data: null,
      });
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

    return responseObject({ data: res[0].id, err: null });
  } catch (e) {
    throw e;
  }
};
export const loginHandler = async ({
  phoneNumber,
  password,
}: {
  phoneNumber: number;
  password: string;
}) => {
  try {
    const user: UserObject[] = await userRepo.getUserByNumber(phoneNumber);
    if (user.length === 0)
      return responseObject({
        err: new LoginFailureError("Phone Number or Password do not match"),
        data: null,
      });
    const { salt, password: pwd, id } = user[0];

    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    if (hash !== pwd)
      return responseObject({
        err: new LoginFailureError("Phone Number or Password do not match"),
        data: null,
      });
    const token = crypto.randomBytes(64).toString("hex");
    const result = await userRepo.addUserSession(id, token);

    return responseObject({ err: null, data: result[0].sessionId });
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user: UserObject[] = await userRepo.getUserById(id);
    if (user.length === 0)
      return responseObject({ err: new ResourceNotFoundError(), data: null });

    return responseObject({ err: null, data: user[0] });
  } catch (error) {
    throw error;
  }
};
export const getUserFromSessionId = async (token: string) => {
  try {
    const user = await userRepo.getUserFromSessionId(token);
    if (user.length === 0)
      return responseObject({ err: new ResourceNotFoundError(), data: null });
    return responseObject({ err: null, data: user[0] });
  } catch (error) {
    throw error;
  }
};
export const deactivateUser = async (id: string) => {
  try {
    const user: Pick<UserObject, "id">[] = await userRepo.deactivateUser(id);
    if (user.length === 0) throw new ResourceNotFoundError();
    const delSessions = await userRepo.deleteAllUserSessions(user[0]?.id);
    return responseObject({ data: "Sessions deleted successful", err: null });
  } catch (error) {
    throw error;
  }
};
export const removeUser = async (id: string) => {
  try {
    const deleted = await userRepo.delUser(id);
    return responseObject({ data: "User successfully deleted", err: null });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, profile: UserObject) => {};

const validateUser = (user: UserObject): { err: string | null } => {
  //TODO validate user
  return { err: null };
};
