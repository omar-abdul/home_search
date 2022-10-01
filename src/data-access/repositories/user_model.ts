/* Interfaces and User/Session Objects */

import { BinaryLike } from "crypto";
import { CustomDatabaseError } from "../../util/customerrors";

export interface User {
  id?: string;
  phoneNumber: number;
  userName: string;
  whatsappNumber: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  password: string;
  salt: string;
  active?: boolean;
}
interface Session {
  sessionId: string;
  userId: string;
  createdAt: Date;
  isRevoked: Boolean;
}
export type UserObject = Required<Pick<User, "id">> & Omit<User, "id">;
export type SessionObject = Partial<Session> &
  Required<Pick<Session, "sessionId">>;

export interface UserModel {
  addUser(user: UserObject): Promise<Pick<UserObject, "id">[]>;
  getUserById(id: string): Promise<UserObject[]>;
  getAllUsers(): Promise<UserObject[]>;
  getUserByEmail(email: string): Promise<UserObject[]>;
  getUserByNumber(phoneNumner: number): Promise<UserObject[]>;
  getUserSession(token: string): Promise<SessionObject[]>;
  delUser(id: string): Promise<number>;
  addUserSession(
    id: string,
    token: string
  ): Promise<Pick<SessionObject, "sessionId">[]>;
  getUserFromSessionId(token: string): Promise<any[]>;
  deactivateUser(id: string): Promise<Pick<UserObject, "id">[]>;
  deleteAllUserSessions(user_id: string): Promise<number>;
}
