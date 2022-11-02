import HomeRepo from "../data-access/repositories/home_repository";
import {
  HomeModel,
  HomeObject,
  Status,
} from "../data-access/repositories/home_model";
import { getCryptoRandomId, responseObject } from "@lib/util";
import {
  CustomDatabaseError,
  ResourceNotFoundError,
  ValidationError,
} from "@lib/customerrors";
import db from "src/data-access/config/db";

const homeRepo: HomeModel = new HomeRepo(db);

export const addHome = async (home: HomeObject) => {
  try {
    // const isHomeObj = validateHomeObj(home);
    // if (isHomeObj.err)
    //   // return responseObject({
    //   //   err: new ValidationError(isHomeObj.err),
    //   //   data: null,
    //   // });
    //   throw new ValidationError(isHomeObj.err)
    home.id = getCryptoRandomId(8);
    const homeId = await homeRepo.addHome(home);
    if (homeId.length === 0)
      // return responseObject({
      //   err: new ResourceNotFoundError(),
      //   data: null,
      // });
      throw new CustomDatabaseError("There was an internal error");
    //if (home.images !== undefined && home.images?.length > 0)
    //await addImages(home);
    return responseObject({ data: homeId[0], err: null });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};

export const deactivateHome = async (id: string) => {
  try {
    if (id === null || id === undefined || id === "")
      throw new ValidationError("Id cannot be blank or undefined");

    const infoToUpdate = { status: Status.Inactive };
    const updated = await homeRepo.changeHomeStatus(infoToUpdate, id);

    if (updated > 0)
      return responseObject({ err: null, data: "Home status updated" });
    throw new ResourceNotFoundError();
  } catch (err) {
    return responseObject({ err, data: null });
  }
};
export const getHomeById = async (id: string) => {
  try {
    const home = await homeRepo.getHomebyID(id);
    if (home === undefined || home === null || home.length < 1)
      return responseObject({
        err: new ResourceNotFoundError(),
        data: null,
      });
    return responseObject({ data: home });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};
export const getAllHomes = async (opts: object = {}) => {
  try {
    const homes = await homeRepo.getAllHomes(opts);
    return responseObject({ data: homes, err: null });
  } catch (err) {
    return responseObject({ err, data: null });
  }
};
export const updateHome = async (
  home: Omit<HomeObject, "homeId" & "id">,
  homeId: string
) => {
  try {
    const updated = await homeRepo.updateHome(home, homeId);
    if (updated > 0)
      return responseObject({ data: "Home Updated Successfully", err: null });
    throw new ResourceNotFoundError();
  } catch (err) {
    return responseObject({ err, data: null });
  }
};

const validateHomeObj = function (home: any): { err: string | null } {
  //TODO Add more validations
  //return "type" in home && (home.type === "Rent" || home.type === "Sale");
  if (
    home?.userId === null ||
    home?.userId === undefined ||
    home?.userId === ""
  )
    return { err: "User id cannot be blank" };
  return { err: null };
};
