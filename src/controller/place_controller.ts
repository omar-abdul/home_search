import PlaceRepo from "../data-access/repositories/places_repository";
import { Places, PlaceModel } from "src/data-access/repositories/places_model";
import { responseObject } from "@lib/util";
import { ResourceNotFoundError } from "@lib/customerrors";
import db from "src/data-access/config/db";

const placeRepo: PlaceModel = new PlaceRepo(db);

export const addPlace = async (place: Places) => {
  return placeRepo
    .addPlace(place)
    .then(() => responseObject({ data: "Success", err: null }))
    .catch((err) => responseObject({ data: null, err }));
};

export const getAllPlaces = async (opts: object) => {
  return placeRepo
    .getAllPlacesWith(opts)
    .then((data) => responseObject({ data, err: null }))
    .catch((err) => responseObject({ data: null, err }));
};

export const updateProximityOfPlace = async (id: number) => {
  return placeRepo
    .updateProximityPlace(id)
    .then(() => responseObject({ data: "success" }))
    .catch((err) => responseObject({ err }));
};

export const getPlace = async (id: number) => {
  return placeRepo
    .getPlace(id)
    .then((data) => responseObject({ data }))
    .catch((err) => responseObject({ err }));
};
