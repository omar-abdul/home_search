import { Knex } from "knex";

export interface Places {
  id?: number;
  name: string;
  lat: number;
  lon: number;
  coordinates?: Knex.Raw;
}

export interface PlaceModel {
  addPlace(place: Places): Promise<number[]>;
  //   updatePlace(id: number): Promise<Pick<PlaceObject, "id">[]>;
  //   getAllPlaces(): Promise<PlaceObject>;
  //   getPlace(id: number): Promise<PlaceObject>;
  //   removePlace(id: number): Promise<number[]>;
}
