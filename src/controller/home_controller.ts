import db from "../data-access/config/db";
import HomeRepo from "../data-access/repositories/home_repository";
import {
  HomeModel,
  HomeObject,
  Status,
} from "../data-access/repositories/home_model";
import { getCryptoRandomId, responseObject } from "../util/util";
import { ResourceNotFoundError, ValidationError } from "../util/customerrors";

const homeRepo: HomeModel = new HomeRepo(db);

export const addHome = async (home: HomeObject) => {
  try {
    const isHomeObj = validateHomeObj(home);
    if (isHomeObj.err)
      return responseObject({
        err: new ValidationError(isHomeObj.err),
        data: null,
      });
    home.id = getCryptoRandomId(8);
    const homeId = await homeRepo.addHome(home);
    if (homeId.length === 0)
      return responseObject({
        err: new ResourceNotFoundError(),
        data: null,
      });
    return responseObject({ data: homeId[0].id, err: null });
  } catch (error) {
    throw error;
  }
};
export const deactivateHome = async (id: string) => {
  try {
    const updated = await homeRepo.changeHomeStatus(Status.Inactive, id);
    return updated > 0
      ? responseObject({ err: null, data: "Home status updated" })
      : responseObject({ err: new ResourceNotFoundError(), data: null });
  } catch (error) {
    throw error;
  }
};
export const getHomeById = async (id: string) => {
  try {
    const home = await homeRepo.getHomebyID(id);
    if (home === undefined || home === null)
      return responseObject({
        err: new ResourceNotFoundError(),
        data: null,
      });
    return responseObject({ data: home[0] });
  } catch (error) {
    throw error;
  }
};
export const getAllHomes = async (opts: object) => {
  try {
    const homes = await homeRepo.getAllHomes(opts);
    return responseObject({ data: homes, err: null });
  } catch (error) {
    throw error;
  }
};

const validateHomeObj = function (home: any): { err: string | null } {
  //TODO Add more validations
  //return "type" in home && (home.type === "Rent" || home.type === "Sale");
  return { err: "" };
};
