import PlaceRepo from "../data-access/repositories/places_repository";
import { Places, PlaceModel } from "src/data-access/repositories/places_model";
import { responseObject } from "@lib/util";
import { ResourceNotFoundError } from "@lib/customerrors";

const placeRepo: PlaceModel = new PlaceRepo();

export const addPlace = async (place: Places) => {
  return placeRepo
    .addPlace(place)
    .then(() => responseObject({ data: "Success", err: null }))
    .catch((err) => responseObject({ data: null, err }));
};
