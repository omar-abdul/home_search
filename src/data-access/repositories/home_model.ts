import { Knex } from "knex";

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
  home_id?: string;
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
}

export interface HomeModel {
  addHome(home: HomeObject): Promise<Pick<HomeObject, "id">[]>;
  removeHome(uuid: string): Promise<number>;
  getAllHomes(opts: object): Promise<HomeObject[]>;
  getHomebyID(uuid: string): Promise<HomeObject[]>;
  changeHomeStatus(status: object, id: string): Promise<number>;
  // updateNearbyLocations():Promise<number>;
}
