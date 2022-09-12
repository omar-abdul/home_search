import { Knex } from "knex";
import { HomeObject } from "./home_model";

export default class HomeRepo {
  private HomeDb;
  constructor(knex: Knex) {
    this.HomeDb = () => knex<HomeObject>("homes");
  }
  async addHome(home: HomeObject) {
    return await this.HomeDb().returning("home_id").insert(home);
  }
  async removeHome(uuid: string) {
    return await this.HomeDb().returning("home_id").where(uuid).del();
  }
  async getAllHomes() {
    return await this.HomeDb().select("*");
  }
  async getHomebyID(uuid: string) {
    return await this.HomeDb().select("*").where("home_id", uuid);
  }
}
