import knex, { Knex } from "knex";
import knexPostGis, { KnexPostgis } from "knex-postgis";
import { CustomDatabaseError, ValidationError } from "@lib/customerrors";
import { NearbyPlace, Places } from "./places_model";
import db from "../config/db";

export default class PlaceRepo {
  private placesDb;
  private st: KnexPostgis;

  private nearbyPlaces;
  constructor(private knex: Knex) {
    this.placesDb = () =>
      this.knex<Places>("places").queryContext("crud_functions");
    this.st = knexPostGis(this.knex);
    this.nearbyPlaces = () =>
      this.knex<NearbyPlace>("homes_nearby_places").queryContext(
        "crud_functions"
      );
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
  async getAllPlacesWith(opts: object) {
    return await this.placesDb().select("*").where(opts);
  }
  async getPlace(id: number) {
    return await this.placesDb().select("*").where("id", id);
  }
  async updateProximityPlace(id: number) {
    /*
     *Get geom of place with id ${id}
     *Get all the ids of homes which are 5000m(5km) away from place
     *Update nearby place table
     *
     *
     *
     */
    const result = await this.getPlace(id);

    const coordinates = result[0].coordinates;

    const ids = await this.knex
      .from("homes")
      .where(
        this.knex.raw(
          "ST_Distance(ST_Transform(??,3857),ST_Transform(?,3857)) <=?",
          ["homes.coordinates", coordinates, 5000]
        )
      )
      .select(
        "home_id",
        this.knex.raw(
          "ST_Distance(ST_Transform(??,3857),ST_Transform(?,3857)) as distance",
          ["homes.coordinates", coordinates]
        )
      );

    if (ids.length > 0) {
      const toInsert: NearbyPlace[] = ids.map((x) => ({
        ...x,
        locationId: id,
      }));
      return await this.nearbyPlaces().insert(toInsert);
    }
  }

  validateLonLat(lon: number, lat: number) {
    return lon <= 180 && lon >= -180 && lat <= 90 && lat >= -90;
  }
}
