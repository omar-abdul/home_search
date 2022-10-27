import { Knex } from "knex";
import knexPostGis, { KnexPostgis } from "knex-postgis";
import db from "../config/db";
import { CustomDatabaseError } from "@lib/customerrors";
import { HomeObject } from "./home_model";

export default class HomeRepo {
  private HomeDb;
  private st: KnexPostgis;
  private knex: Knex;
  constructor() {
    this.knex = db;
    this.HomeDb = () =>
      this.knex<HomeObject>("homes").queryContext("crud_functions");
    this.st = knexPostGis(this.knex);
  }
  async addHome(home: HomeObject) {
    try {
      const newHome = (({ lon, lat, ...obj }) => obj)(home); // creating a newHome object from existing home obj to create coordinates
      const { lon, lat } = home;
      if (!this.validateLonLat(lon, lat))
        throw new Error("Invalid Longtitude & Latitude values");

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
  async changeHomeStatus(statusobj: object, id: string) {
    try {
      return await this.HomeDb().where("id", id).update(statusobj);
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  validateLonLat(lon: number, lat: number) {
    return lon <= 180 && lon >= -180 && lat <= 90 && lat >= -90;
  }
}
