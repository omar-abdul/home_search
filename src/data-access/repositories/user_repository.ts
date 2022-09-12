import { Knex } from "knex";
import { UserObject, SessionObject } from "./user_model";

export default class UserRepo {
  private UserDb;
  private sessionDb;
  constructor(knex: Knex) {
    this.UserDb = () => knex<UserObject>("users");
    this.sessionDb = () => knex<SessionObject>("sessions");
  }
  async addUser(user: UserObject) {
    return await this.UserDb().insert(user).returning("id");
  }
  async getUserById(id: string) {
    return await this.UserDb().where("id", id).select("*");
  }
  async getUserByEmail(email: string) {
    return await this.UserDb().where("email", email).select("*");
  }
  async getUserByNumber(phoneNumber: number) {
    return await this.UserDb().where("phoneNumber", phoneNumber).select("*");
  }
  async getUserSession(token: string) {
    return await this.sessionDb().where("session_id", token).select("*");
  }
  async getAllUsers() {
    return await this.UserDb().select("*");
  }
  async delUser(id: string) {
    return await this.UserDb().where("id", id).del();
  }

  async addUserSession(id: string, token: string) {
    return await this.sessionDb().insert(
      { sessionId: token, userId: id, isRevoked: false },
      "sessionId"
    );
  }
  async getUserFromSessionId(token: string) {
    return await this.UserDb()
      .join("sessions", "users.id", "sessions.user_id")
      .where("sessions.sessionId", token)
      .select("*");
  }
  async deactivateUser(id: string) {
    return await this.UserDb().update("active", false, "id").where("id", id);
  }
  async deleteAllUserSessions(id: string) {
    return await this.sessionDb().where("userId", id).del();
  }
}
