import db from "../data-access/config/db";
import HomeRepo from "../data-access/repositories/home_repository";
import {
  HomeModel,
  HomeObject,
  Status,
} from "../data-access/repositories/home_model";
import { getCryptoRandomId, responseObject } from "../util/util";

const homeRepo: HomeModel = new HomeRepo(db);

export const addHome = async (home: HomeObject) => {
  const isHomeObj = validateHomeObj(home);
  if (!isHomeObj)
    return responseObject({ err: "Error in validation", success: false });
  home.id = getCryptoRandomId(8);
  const homeId = await homeRepo.addHome(home);
  if (homeId.length === 0)
    return responseObject({
      err: "There was an error in adding the listing",
      success: false,
    });
  return responseObject({ success: true, data: homeId[0].id });
};
export const deactivateHome = async (id: string) => {
  let updated;
  try {
    updated = await homeRepo.changeHomeStatus(Status.Inactive, id);
  } catch (e) {
    console.log(e);
    return responseObject({
      success: false,
      err: e,
    });
  }

  //if (updated === undefined || updated === null) console.log(updated);
  return responseObject({ success: true, data: "listing updated" });
};
export const getHomeById = async (id: string) => {
  const home = await homeRepo.getHomebyID(id);
  if (home === undefined || home === null)
    return responseObject({
      success: false,
      err: "Something went wrong retriving the error",
    });
  return responseObject({ success: true, data: home[0] });
};
export const getAllHomes = async (opts: object) => {
  const homes = await homeRepo.getAllHomes(opts);
  if (homes === undefined || homes === null)
    return responseObject({
      err: "There was an error retriving",
      success: false,
    });
  return responseObject({ success: true, data: homes });
};

const validateHomeObj = function (home: any): home is HomeObject {
  //TODO Add more validations
  return "type" in home && (home.type === "Rent" || home.type === "Sale");
};
