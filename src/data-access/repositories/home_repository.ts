import { Knex } from "knex";
import knexPostGis, { KnexPostgis } from "knex-postgis";
import { ValidationError as JoiValidationError } from "joi";
import db from "../config/db";
import { CustomDatabaseError, ValidationError } from "@lib/customerrors";
import { HomeObject, validateHomeValues } from "./home_model";
import storage from "../config/firebase";

export default class HomeRepo {
  private HomeDb;
  private st: KnexPostgis;

  constructor(private knex: Knex) {
    this.HomeDb = () =>
      this.knex<HomeObject>("homes").queryContext("crud_functions");

    this.st = knexPostGis(this.knex);
  }
  async addHome(home: HomeObject) {
    try {
      // const newHome = (({ lon, lat, ...obj }) => obj)(home); // creating a newHome object from existing home obj to create coordinates
      const { lon, lat } = home;
      if (!this.validateLonLat(lon, lat))
        throw new ValidationError("Invalid Longtitude & Latitude values");
      this.validateHome(home);

      home.coordinates = this.st.geomFromText(
        `Point(${home.lon} ${home.lat})`,
        4326
      );
      const imageArray = home.images instanceof Array ? [...home.images] : [];
      home.images = {};
      return this.HomeDb()
        .insert(home)
        .returning("home_id")
        .then(async (res) => {
          await this.uploadImages(imageArray, res[0]);
          return res;
        });
    } catch (error: any) {
      if (error instanceof ValidationError) throw error;
      throw new CustomDatabaseError(error.message);
    }
  }

  async uploadImages(image: any[], homeId: { [key: string]: any }) {
    let tempArr: string[] = [];
    image.forEach(async (img) => {
      const urlToSave = `https://firebasestorage.googleapis.com/v0/b/homesearch-3bd22.appspot.com/o/${homeId.homeId}%2F${img.filename}?alt=media`;

      storage
        .upload(`${img.path}`, {
          destination: `${homeId?.homeId}/${img.filename}`,
        })
        .then((v) => {});
      tempArr.push(urlToSave);
    });
    let imgJsonToSave = {};
    Object.assign(imgJsonToSave, tempArr);

    return await this.HomeDb()
      .where(homeId)
      .update("images", imgJsonToSave)
      .returning("homeId");
  }

  async removeHome(uuid: string) {
    try {
      return await this.HomeDb().returning("home_id").where(uuid).del();
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getAllHomes(
    opts: Omit<HomeObject, "id" | "homeId" | "user_id" | "isPaid">
  ) {
    try {
      if (opts.lat && opts.lon) {
        if (this.validateLonLat(opts.lon, opts.lat)) {
          let stQuery = this.st.distance(
            this.st.transform(
              this.st.geomFromText(`Point(${opts.lon} ${opts.lat})`, 4326),
              3857
            ),
            this.st.transform("homes.coordinates", 3857)
          );

          return await this.HomeDb()
            .where(opts)
            .andWhere(stQuery, "<=", "500")
            .select("*");
        }
      }

      return await this.HomeDb().where(opts).select("*");
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async getHomebyID(id: string) {
    try {
      return await this.HomeDb().select("*").where("home_id", id);
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async changeHomeStatus(statusobj: object, id: string) {
    try {
      return await this.HomeDb().where("home_id", id).update(statusobj);
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  async updateHome(home: Omit<HomeObject, "homeId" & "id">, homeId: string) {
    try {
      home.homeId = home.id = "";
      return await this.HomeDb().where("home_id", homeId).update(home);
    } catch (error: any) {
      throw new CustomDatabaseError(error.message);
    }
  }
  private validateLonLat(lon: number, lat: number) {
    return lon <= 180 && lon >= -180 && lat <= 90 && lat >= -90;
  }
  private replaceName(text: string, newName: string) {
    var re = /^(.*\/)?[^\/]+\.(png|gif|jpe?g)$/i;
    var rep_str = "$1" + newName + ".$2";
    text = text.replace(re, rep_str);
    return text;
  }

  private validateHome(obj: {}) {
    const { error, value } = validateHomeValues(obj);
    if (error)
      throw new ValidationError(error.message, error._original, error.details);
    return;
  }
}
