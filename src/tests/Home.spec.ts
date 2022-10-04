import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  HomeObject,
  ListingType,
  Locations,
  Status,
} from "../data-access/repositories/home_model";

import * as homeController from "../controller/home_controller";
import { UserObject } from "../data-access/repositories/user_model";
import * as userController from "../controller/user_controller";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Homes/Listing Controller", () => {
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
      salt: "",
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
      lon: 0,
      lat: 0,
    };
  });
  describe("Adding a new listing", () => {
    it("*****adds new Home", async () => {
      const { err, data } = await userController.addUser(userObj);

      if (!err && data) homeObj.userId = data;

      const id = await homeController.addHome(homeObj);
      _id = id.data;
      expect(data).to.be.an("string");

      expect(id.data).to.be.a("string");
    });
  });
  describe("Getting listings----", () => {
    it("*****Gets all homes", async () => {
      const { data } = await homeController.getAllHomes({});

      expect(data).to.be.an("array");
      expect(data).length.greaterThan(0);
    });
    it("*****Get listing with ID ", async () => {
      const { data } = await homeController.getHomeById(_id);

      expect(data).to.be.an("object");
      expect(data.id).to.be.a("string");
    });
  });
  describe("Deactivate Listing", () => {
    it("*****Deactivate Listing", async () => {
      const result = await homeController.deactivateHome(_id);

      expect(result.err).to.be.null;
      expect(result?.data).to.be.a("string");
    });
  });
});
