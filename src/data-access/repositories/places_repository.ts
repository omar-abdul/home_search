import knex, { Knex } from "knex";
import knexPostGis, { KnexPostgis } from "knex-postgis";
import { CustomDatabaseError, ValidationError } from "@lib/customerrors";
import { Places } from "./places_model";
import db from "../config/db";

export default class PlaceRepo {
  private placesDb;
  private st: KnexPostgis;
  private knex: Knex;
  constructor() {
    this.knex = db;
    this.placesDb = () =>
      this.knex<Places>("places").queryContext("crud_functions");
    this.st = knexPostGis(this.knex);
  }
  async addPlace(place: Places) {
    const newPlace = (({ lon, lat, ...obj }) => obj)(place);
    const { lon, lat } = place;
    if (!this.validateLonLat(lon, lat))
      throw new ValidationError("Invalid Longtitude & Latitude values");
    newPlace.coordinates = this.st.geomFromText(`Point(${lon} ${lat})`, 4326);

    return await this.placesDb().insert(newPlace);
  }
  async updatePlace(id: number) {}
  async removePlace(id: number) {}
  async getAllPlaces() {}
  async getPlace(id: number) {}

  validateLonLat(lon: number, lat: number) {
    return lon <= 180 && lon >= -180 && lat <= 90 && lat >= -90;
  }
}
