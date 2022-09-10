import db from "../data-access/config/db";
import HomeRepo from "../data-access/repositories/home_repository";
import { HomeModel, HomeObject } from "../data-access/repositories/home_model";

const homeRepo: HomeModel = new HomeRepo(db);

export const addHome = function (home: HomeObject): Promise<number[] | Error> {
  const isHomeObj = validateHomeObj(home);
  let uuid: number[] = [];
  if (isHomeObj) {
    return homeRepo
      .addHome(home)
      .then((val) => (uuid = val))
      .catch((e) => new Error(e.message));
  }
  return Promise.resolve(uuid);
};

const validateHomeObj = function (home: any): home is HomeObject {
  return "type" in home && (home.type === "Rent" || home.type === "Sale");
};
