import { Knex } from "knex";
import { CustomDatabaseError } from "../../lib/customerrors";
import { HomeObject } from "./home_model";
import knexPostGis, { KnexPostgis } from "knex-postgis";

export default class HomeRepo {
  private HomeDb;
  private st: KnexPostgis;
  constructor(knex: Knex) {
    this.HomeDb = () =>
      knex<HomeObject>("homes").queryContext("crud_functions");
    this.st = knexPostGis(knex);
  }
  async addHome(home: HomeObject) {
    try {
      const newHome = (({ lon, lat, ...obj }) => obj)(home);

      newHome.coordinates = this.st.geomFromText(
        `Point(${home.lon} ${home.lat})`,
        4326
      );
      return await this.HomeDb().insert(newHome).returning("id");
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
  // async updateNearbyLocations(){

  // }
}
