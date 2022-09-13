import * as chai from "chai";
const chaiAsPromised = require("chai-as-promised");

import db from "../data-access/config/db";
import {
  HomeObject,
  ListingType,
  Locations,
  Status,
} from "../data-access/repositories/home_model";

import mig from "../data-access/migrations/home_migrations";
import { tableExists } from "../util/util";
import * as homeController from "../controller/home_controller";
import { UserObject } from "../data-access/repositories/user_model";
import * as userController from "../controller/user_controller";
import exp from "constants";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Home Migrations", () => {
  describe("Check dropped", () => {
    it("Check Down", async () => {
      return mig.down(db).then(async () => {
        const homeExists = await tableExists(db, "homes");
        const usersExist = await tableExists(db, "users");
        expect(usersExist).to.be.false;
        expect(homeExists).to.be.false;
      });
    });
  });
  describe("Check table created", () => {
    it("Check Up", async () => {
      return mig.up(db).then(async () => {
        const userExists = await tableExists(db, "users");
        const homeExists = await tableExists(db, "homes");
        expect(userExists).to.be.true;
        expect(homeExists).to.be.true;
      });
    });
  });
});

describe("Homes Controller", () => {
  let homeObj: HomeObject;
  let userObj: UserObject;
  let _id: string;
  before(() => {
    userObj = {
      id: "",
      phoneNumber: 54444,
      whatsappNumber: 5444,
      userName: "specialname",
      email: "myemail.com",
      firstName: "Mine",
      lastName: "you",
      password: "5555",
    };
    homeObj = {
      id: "undefined",
      location: Locations.Burco,
      type: ListingType.Sale,
      description: "home for sale",
      roomNumbers: 3,
      price: 3.5,
      userId: "",
      isPaid: false,
      status: Status.Active,
    };
  });
  describe("Adding a new listing", () => {
    it("adds new Home", async () => {
      const { err, data } = await userController.addUser(userObj);

      if (!err && data) homeObj.userId = data;

      const id = await homeController.addHome(homeObj);
      _id = id.data;
      expect(data).to.be.an("string");
      expect(id.success).to.be.true;
      expect(id.data).to.be.a("string");
    });
  });
  describe("Getting listings----", () => {
    it("*********Gets all homes", async () => {
      const { success, data } = await homeController.getAllHomes({});
      expect(success).to.be.true;
      expect(data).to.be.an("array");
      expect(data).length.greaterThan(0);
    });
    it("******* Get listing with ID ", async () => {
      const { success, data } = await homeController.getHomeById(_id);
      expect(success).to.be.true;
      expect(data).to.be.an("object");
      expect(data.id).to.be.a("string");
    });
  });
  describe("Deactivate Listing", () => {
    it("********* Deactivate Listing", async () => {
      const { success, data } = await homeController.deactivateHome(_id);
      expect(success).to.be.true;
      expect(data).to.be.a("string");
    });
  });
});
// function asyncExpect(test: any, done: any) {
//   try {
//     test();
//     done();
//   } catch (error) {
//     done(error);
//   }
// }
