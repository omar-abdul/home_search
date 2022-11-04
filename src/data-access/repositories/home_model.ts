import { Knex } from "knex";
import { HomeSchema } from "./validate_schema";

export enum Locations {
  Laascanod = "Laascanod",
  Burco = "Burco",
  Hargeisa = "Hargeisa",
  Borama = "Borama",
  Ceerigabo = "Ceerigabo",
}
export enum ListingType {
  Rent = "Rent",
  Sale = "Sale",
}
export enum Status {
  Active = "active",
  Inactive = "inactive",
  PP = "pending payment",
  NA = "not available",
  Sold = "sold",
}

export interface HomeObject {
  id: string;
  homeId?: string;
  type: ListingType;
  location: Locations;
  description: string;
  roomNumbers: number;
  price: number;
  userId: string;
  isPaid: boolean;
  lon: number;
  lat: number;
  coordinates?: Knex.Raw;
  status?: Status;
  images: any;
  furnish?: "furnished" | "not furnished";
}

export interface HomeModel {
  addHome(home: HomeObject): Promise<Pick<HomeObject, "homeId">[]>;
  removeHome(uuid: string): Promise<number>;
  getAllHomes(opts: object): Promise<HomeObject[]>;
  getHomebyID(uuid: string): Promise<HomeObject[]>;
  changeHomeStatus(status: object, id: string): Promise<number>;
  updateHome(
    home: Omit<HomeObject, "home_id" & "id">,
    home_id: string
  ): Promise<number>;
  // updateNearbyLocations():Promise<number>;
}

export const validateHomeValues = (obj: {}) => {
  return HomeSchema.validate(obj);
};
