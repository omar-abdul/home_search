import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";

import {
  HomeModel,
  HomeObject,
  ListingType,
  Locations,
  Status,
} from "../../data-access/repositories/home_model";

import * as homeController from "../../controller/home_controller";
import { UserObject } from "../../data-access/repositories/user_model";
import HomeRepo from "../../data-access/repositories/home_repository";
import {
  CustomDatabaseError,
  ResourceNotFoundError,
  ValidationError,
} from "@lib/customerrors";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Homes/Listing Controller", () => {
  let homeObj: HomeObject;
  let userObj: UserObject;
  let _id: string;
  let homeRepo: HomeModel;
  beforeEach(() => {
    homeObj = {
      id: "undefined",
      location: Locations.Burco,
      type: ListingType.Sale,
      description: "home for sale",
      roomNumbers: 3,
      price: 3.5,
      userId: "somefakeId",
      isPaid: false,
      status: Status.Active,
      lon: 0,
      lat: 0,
    };
  });
  afterEach(() => {
    sinon.restore();
  });
  describe("Adding a new listing", () => {
    it("Should add new Home", async () => {
      const homestub = sinon
        .stub(HomeRepo.prototype, "addHome")
        .withArgs(homeObj)
        .callsFake(function fakefun() {
          return Promise.resolve([{ id: "fakeid" }]);
        });
      const { err, data } = await homeController.addHome(homeObj);
      expect(homestub.called).to.be.true;
      expect(data).to.be.an("object").deep.equal({ id: "fakeid" });
    });

    it("Should reject adding home without a userId", async function () {
      homeObj.userId = "";
      const homestub = sinon
        .stub(HomeRepo.prototype, "addHome")
        .withArgs(homeObj)
        .callsFake(function fakefun() {
          return Promise.resolve([{ id: "fakeid" }]);
        });
      const { err, data } = await homeController.addHome(homeObj);
      expect(homestub.called).to.be.false;
      expect(data).to.be.null;
      expect(err).to.be.instanceOf(ValidationError);
    });
    it("Should return response inside err", async function () {
      const homeStub = sinon
        .stub(HomeRepo.prototype, "addHome")
        .withArgs(homeObj)
        .throws(function () {
          return new CustomDatabaseError("Error");
        });
      const { err, data } = await homeController.addHome(homeObj);
      expect(err).to.be.instanceOf(CustomDatabaseError);
    });
  });
  describe("Getting Listings", function () {
    it("Should get all homes", async function () {
      const home_fake: HomeObject[] = [
        {
          id: "fakehomeid",
          type: ListingType.Rent,
          location: Locations.Burco,
          roomNumbers: 4,
          price: 500,
          userId: "fakeuserid",
          description: "some description",
          isPaid: false,
          lon: 0,
          lat: 0,
        },
        {
          id: "secondfakehomeid",
          type: ListingType.Rent,
          location: Locations.Borama,
          roomNumbers: 6,
          price: 100,
          userId: "secondfakeuserid",
          description: "description",
          isPaid: true,
          lon: 0.5,
          lat: 0.5,
        },
      ];
      const home_stub = sinon
        .stub(HomeRepo.prototype, "getAllHomes")
        .callsFake(() => {
          return Promise.resolve(home_fake);
        });
      const { err, data } = await homeController.getAllHomes();
      expect(home_stub.called).to.be.true;
      expect(data).to.be.an("array").deep.equals(home_fake);
    });

    it("Should get home with a single id", async function () {
      const home_fake: HomeObject[] = [
        {
          id: "fakehomeid",
          type: ListingType.Rent,
          location: Locations.Burco,
          roomNumbers: 4,
          price: 500,
          userId: "fakeuserid",
          description: "some description",
          isPaid: false,
          lon: 0,
          lat: 0,
        },
      ];
      _id = "fakehomeid";
      const home_stub = sinon
        .stub(HomeRepo.prototype, "getHomebyID")
        .withArgs(_id)
        .callsFake(() => {
          return Promise.resolve(home_fake);
        });
      const { err, data } = await homeController.getHomeById(_id);
      expect(data).to.eql(home_fake);
    });
    it("Should return ResourceNotFound error when home not found", async function () {
      _id = "FAKEIDNOTEXIST";
      const home_stub = sinon
        .stub(HomeRepo.prototype, "getHomebyID")
        .withArgs(_id)
        .callsFake(() => {
          return Promise.resolve([]);
        });
      const { err, data } = await homeController.getHomeById(_id);
      expect(home_stub.called).to.be.true;
      expect(err).to.be.instanceOf(ResourceNotFoundError);
    });

    it("Should return CustomDatabase error when invalid parameters passed", async function () {
      _id = "";
      const home_stub = sinon
        .stub(HomeRepo.prototype, "getHomebyID")
        .throws(function () {
          return new CustomDatabaseError("Testing error");
        });
      const { err, data } = await homeController.getHomeById(_id);
      expect(home_stub.called).to.be.true;
      expect(err).to.be.instanceOf(CustomDatabaseError);
      expect(data).to.be.null;
    });
  });

  describe("Listing Status", async function () {
    it("Should deactivate listing from", async function () {
      const home_stub = sinon
        .stub(HomeRepo.prototype, "changeHomeStatus")
        .resolves(1);
      const { data, err } = await homeController.deactivateHome("fakeId");
      expect(data).to.be.a.string("Home status updated");
      expect(err).to.be.null;
    });

    it("Should return an ResourceNotFound err response when no row is updated", async function () {
      const home_stub = sinon
        .stub(HomeRepo.prototype, "changeHomeStatus")
        .resolves(0);
      const { data, err } = await homeController.deactivateHome(
        "nonexistentid"
      );
      expect(data).to.be.null;
      expect(err).to.be.an.instanceOf(ResourceNotFoundError);
    });
    it("Should return an ValidattionError err response when no/empty ID is passed", async function () {
      const home_stub = sinon
        .stub(HomeRepo.prototype, "changeHomeStatus")
        .resolves(0);
      const { data, err } = await homeController.deactivateHome("");
      expect(data).to.be.null;
      expect(err).to.be.an.instanceOf(ValidationError);
    });
  });
});
