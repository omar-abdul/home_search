import { Knex } from "knex";
import { CustomDatabaseError } from "../../util/customerrors";
import { HomeObject } from "./home_model";

export default class HomeRepo {
  private HomeDb;
  constructor(knex: Knex) {
    this.HomeDb = () =>
      knex<HomeObject>("homes").queryContext("crud_functions");
  }
  async addHome(home: HomeObject) {
    try {
      return await this.HomeDb().insert(home).returning("id");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async removeHome(uuid: string) {
    try {
      return await this.HomeDb().returning("home_id").where(uuid).del();
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getAllHomes(opts: object) {
    try {
      return await this.HomeDb().where(opts).select("*");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getHomebyID(id: string) {
    try {
      return await this.HomeDb().select("*").where("id", id);
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async changeHomeStatus(status: string, id: string) {
    try {
      return await this.HomeDb().where("id", id).update("price", 5);
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
}
