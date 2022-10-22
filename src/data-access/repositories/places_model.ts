import { Knex } from "knex";

export interface Places {
  id?: number;
  name: string;
  lat: number;
  lon: number;
  coordinates?: Knex.Raw;
}
export interface NearbyPlace {
  id: number;
  homeId: string;
  locationId: number;
  distance: number;
}

export interface PlaceModel {
  addPlace(place: Places): Promise<number[]>;
  //   updatePlace(id: number): Promise<Pick<PlaceObject, "id">[]>;
  getAllPlacesWith(opts: object): Promise<Places[]>;
  getPlace(id: number): Promise<Places[]>;
  //   removePlace(id: number): Promise<number[]>;
  updateProximityPlace(id: number): Promise<number[] | undefined>;
}
