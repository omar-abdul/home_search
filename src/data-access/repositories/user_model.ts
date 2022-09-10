/* Interfaces and User/Session Objects */

interface User {
  id?: string;
  phoneNumber: number;
  userName: string;
  whatsappNumber: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  password: string;
  salt?: string | "";
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
  getSingleUser(id: string): Promise<UserObject[]>;
  getAllUsers(): Promise<UserObject[]>;
  getUserByEmail(email: string): Promise<UserObject[]>;
  getUserByNumber(phoneNumner: number): Promise<UserObject[]>;
  getUserBySession(token: string): Promise<SessionObject[]>;
  delUser(id: string): Promise<number>;
  addUserSession(
    id: string,
    token: string
  ): Promise<Pick<SessionObject, "sessionId">[]>;
}
