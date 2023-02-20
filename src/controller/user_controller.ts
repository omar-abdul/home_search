/*
 *
 * User Controller Functions,
 * Business Logic with Regards to User
 *
 */

import crypto from "crypto";
import * as argon from "argon2";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import db from "../data-access/config/db";
import UserRepo from "../data-access/repositories/user_repository";
import { UserModel, UserObject } from "../data-access/repositories/user_model";
import { genRandomId, getCryptoRandomId, responseObject } from "../lib/util";
import {
  LoginFailureError,
  ResourceNotFoundError,
  UserInputError,
  ValidationError,
} from "@lib/customerrors";

import { UserSchema } from "src/data-access/repositories/validate_schema";

const userRepo: UserModel = new UserRepo(db);

export const addUser = async (user: UserObject) => {
  try {
    const isValidUser = validateUser(user);
    let res: Pick<UserObject, "id">[];
    const { error, value } = UserSchema.validate(user);

    if (error)
      throw new ValidationError(error.message, error._original, error.details);
    if (isValidPhoneNumber(user.phoneNumber, "SO") === false)
      throw new ValidationError("Invalid SO Phone number");
    const localPhoneNum = parsePhoneNumber(user.phoneNumber, "SO");

    user.phoneNumber = localPhoneNum?.formatNational()!;
    let { salt } = user;
    const user_exists = await userRepo.getUserByNumber(user.phoneNumber);
    if (user_exists.length > 0)
      throw new UserInputError(
        "User with this phone number is already registered"
      );

    salt = getCryptoRandomId(16);
    // const hash = crypto
    //   .pbkdf2Sync(user.password, salt, 1000, 64, "sha512")
    //   .toString("hex");
    const hash = await argon.hash(user.password);
    const { password: _pass, phoneNumber } = user;

    user.id = await genRandomId();
    user.password = hash;
    user.salt = salt;
    res = await userRepo.addUser(user);

    // const sessionId = await loginHandler({ phoneNumber, password: _pass });

    return responseObject({ data: res[0].id, err: null });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};
export const loginHandler = async ({
  phoneNumber,
  password,
}: {
  phoneNumber: string;
  password: string;
}) => {
  try {
    const localPhoneNum = parsePhoneNumber(phoneNumber, "SO");

    phoneNumber = localPhoneNum?.formatNational()!;
    const user: UserObject[] = await userRepo.getUserByNumber(phoneNumber);

    if (user.length === 0)
      throw new LoginFailureError("Phone Number or Password do not match");
    const { salt, password: pwd, id } = user[0];

    // const hash = crypto
    //   .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    //   .toString("hex");
    if ((await argon.verify(pwd, password)) === false)
      // if (hash !== pwd)
      throw new LoginFailureError("Phone Number or Password do not match");
    const token = crypto.randomBytes(64).toString("hex");
    const result = await userRepo.addUserSession(id, token);

    return responseObject({ err: null, data: result[0].sessionId });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};

export const getUserById = async (id: string) => {
  try {
    const user: UserObject[] = await userRepo.getUserById(id);
    if (user.length === 0) throw new ResourceNotFoundError();

    return responseObject({ err: null, data: user[0] });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};
export const getUserFromSessionId = async (token: string) => {
  try {
    const user = await userRepo.getUserFromSessionId(token);
    if (user.length === 0) throw new ResourceNotFoundError();
    return responseObject({ err: null, data: user[0] });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};
export const deactivateUser = async (id: string) => {
  try {
    const user: Pick<UserObject, "id">[] = await userRepo.deactivateUser(id);
    if (user.length === 0) throw new ResourceNotFoundError();
    const delSessions = await userRepo.deleteAllUserSessions(user[0]?.id);
    return responseObject({ data: "Sessions deleted successful", err: null });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};
export const removeUser = async (id: string) => {
  try {
    const deleted = await userRepo.delUser(id);
    if (deleted === 0) throw new ResourceNotFoundError();
    return responseObject({ data: "User successfully deleted", err: null });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};

export const updateUser = async (id: string, profile: Partial<UserObject>) => {
  try {
    const updatedRows = await userRepo.updateUser(id, profile);
    if (updatedRows > 0)
      return responseObject({ data: "Update successful", err: null });
    throw new ResourceNotFoundError();
  } catch (err) {
    return responseObject({ err, data: null });
  }
};

const validateUser = (user: UserObject): { err: string | null } => {
  //TODO validate user
  return { err: null };
};
