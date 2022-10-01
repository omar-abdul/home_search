import { Knex } from "knex";
import { CustomDatabaseError } from "../../util/customerrors";
import { UserObject, SessionObject } from "./user_model";

export default class UserRepo {
  private UserDb;
  private sessionDb;
  constructor(knex: Knex) {
    this.UserDb = () =>
      knex<UserObject>("users").queryContext("crud_functions");
    this.sessionDb = () =>
      knex<SessionObject>("sessions").queryContext("crud_functions");
  }
  async addUser(user: UserObject) {
    try {
      return await this.UserDb().insert(user).returning("id");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getUserById(id: string) {
    try {
      return await this.UserDb().where("id", id).select("*");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getUserByEmail(email: string) {
    try {
      return await this.UserDb().where("email", email).select("*");
    } catch (err: any) {
      throw new CustomDatabaseError(err.message);
    }
  }
  async getUserByNumber(phoneNumber: number) {
    try {
      return await this.UserDb().where("phoneNumber", phoneNumber).select("*");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getUserSession(token: string) {
    try {
      return await this.sessionDb().where("session_id", token).select("*");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getAllUsers() {
    try {
      return await this.UserDb().select("*");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async delUser(id: string) {
    try {
      return await this.UserDb().where("id", id).del();
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }

  async addUserSession(id: string, token: string) {
    try {
      return await this.sessionDb()
        .insert({ sessionId: token, userId: id, isRevoked: false })
        .returning("sessionId");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getUserFromSessionId(token: string) {
    try {
      return await this.UserDb()
        .join("sessions", "users.id", "sessions.user_id")
        .where("sessions.sessionId", token)
        .select(
          "users.id,users.phoneNumber,users.userName,users.profilePic,users.email,users.whatsappNumber,users.firstName,users.lastName,users.middleName"
        );
    } catch (err: any) {
      throw new CustomDatabaseError(err.message);
    }
  }
  async deactivateUser(id: string) {
    try {
      return await this.UserDb().update("active", false, "id").where("id", id);
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async deleteAllUserSessions(id: string) {
    try {
      return await this.sessionDb().where("userId", id).del();
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
}
