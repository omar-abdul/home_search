import { Knex } from "knex";
import { HomeObject } from "./home_model";

export default class HomeRepo {
  private HomeDb;
  constructor(knex: Knex) {
    this.HomeDb = () => knex<HomeObject>("homes");
  }
  async addHome(home: HomeObject) {
    return await this.HomeDb().insert(home).returning("id");
  }
  async removeHome(uuid: string) {
    return await this.HomeDb().returning("home_id").where(uuid).del();
  }
  async getAllHomes(opts: object) {
    return await this.HomeDb().where(opts).select("*");
  }
  async getHomebyID(id: string) {
    return await this.HomeDb().select("*").where("id", id);
  }
  async changeHomeStatus(status: string, id: string) {
    return await this.HomeDb().where("id", id).update("price", 5);
  }
}
