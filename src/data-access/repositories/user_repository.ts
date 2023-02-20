import { Knex } from "knex";
import db from "../config/db";
import { CustomDatabaseError } from "../../lib/customerrors";
import {
  UserObject,
  SessionObject,
  validateUserObject,
  idvalidate,
} from "./user_model";
import { UserSchema } from "./validate_schema";

export default class UserRepo {
  private UserDb;
  private sessionDb;
  // private knex: Knex;
  constructor(private knex: Knex) {
    this.UserDb = () =>
      this.knex<UserObject>("users").queryContext("crud_functions");
    this.sessionDb = () =>
      this.knex<SessionObject>("sessions").queryContext("crud_functions");
  }
  async addUser(user: UserObject) {
    try {
      const u = (({ repeatPassword, ...obj }) => obj)(user);
      return await this.UserDb().insert(u).returning("id");
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
  async getUserByNumber(phoneNumber: string) {
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
      this.valdiateId(id);

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
        .from("users")
        .join("sessions", "users.id", "sessions.user_id")
        .where("sessions.sessionId", token)
        .andWhere("sessions.isRevoked", false)
        .select(
          "users.id",
          "users.phoneNumber",
          "users.userName",
          "users.profilePic",
          "users.email",
          "users.whatsappNumber",
          "users.firstName",
          "users.lastName",
          "users.middleName"
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

  async updateUser(id: string, userOb: Partial<UserObject>) {
    try {
      this.validateUserObject(userOb);
      this.valdiateId(id);
      return await this.UserDb().update(userOb).where("id", id);
    } catch (err: any) {
      throw new CustomDatabaseError(err.message);
    }
  }

  private validateUserObject(object: Partial<UserObject>) {
    // const { error, value } = validateUserObject(object);
    // if (error) throw error;
    return;
  }
  private valdiateId(id: string) {
    const { error, value } = idvalidate(id);

    if (error) throw error;
    return;
  }
}
