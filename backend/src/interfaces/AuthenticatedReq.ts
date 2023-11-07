import { UserObject } from "../data-access/repositories/user_model";

export type AuthUser = Partial<UserObject> & Express.User;
