import { Knex } from "knex";

export interface HomeObject {
  id: string;
  uuid?: string;
  type: string;
  location: string;
  description: string;
  roomNumbers: number;
  price: number;
  userId: string;
}

export interface HomeModel {
  addHome(home: HomeObject): Promise<number[]>;
  removeHome(uuid: string): Promise<number>;
  getAllHomes(): Promise<HomeObject[]>;
  getSingleHome(uuid: string): Promise<HomeObject[]>;
}
