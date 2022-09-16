import * as chai from "chai";
import { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

import db from "../data-access/config/db";
import mig from "../data-access/migrations/home_migrations";
import { CustomDatabaseError, LoginFailureError } from "../util/customerrors";
import { tableExists } from "../util/util";
import * as userController from "../controller/user_controller";
import * as homeController from "../controller/home_controller";
import { UserObject } from "../data-access/repositories/user_model";
import { ListingType, Locations } from "../data-access/repositories/home_model";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Database  Migrations", () => {
  describe("Down", () => {
    it("Check Down", async () => {
      return mig.down(db).then(async () => {
        const homeExists = await tableExists(db, "homes");
        const usersExist = await tableExists(db, "users");
        expect(usersExist).to.be.false;
        expect(homeExists).to.be.false;
      });
    });
  });
  describe("Check Up", () => {
    it("Up", async () => {
      return mig.up(db).then(async () => {
        const userExists = await tableExists(db, "users");
        const homeExists = await tableExists(db, "homes");
        expect(userExists).to.be.true;
        expect(homeExists).to.be.true;
      });
    });
  });
});

describe("Throwing Database Error on user", () => {
  it("*****Should throw a CustomDatabaseError when adding user", async () => {
    const data: UserObject = {
      id: "test",
      phoneNumber: 5444,
      whatsappNumber: 5444,
      userName: "specialname4",
      email: "myemail3.com",
      firstName: "Mine",
      lastName: "you",
      password: "somepassword",
      active: true,
      salt: "",
    };
    const duplicate: UserObject = {
      id: "test",
      phoneNumber: 5444,
      whatsappNumber: 5444,
      userName: "specialname4",
      email: "myemail3.com",
      firstName: "Mine",
      lastName: "you",
      password: "somepassword",
      active: true,
      salt: "",
    };
    await userController.addUser(data);
    return expect(userController.addUser(data)).to.be.rejectedWith(
      CustomDatabaseError
    );
  });
});

describe("Throwing Database Errors on homes", () => {
  it("*****Should throw a CustomDatabaseError when adding a listing", async () => {
    const homeObj = {
      id: "undefined",
      location: Locations.Burco,
      type: ListingType.Sale,
      description: "home for sale",
      roomNumbers: 3,
      price: 3.5,
      userId: "",
      isPaid: false,
      status: undefined,
    };
    return expect(homeController.addHome(homeObj)).to.be.rejectedWith(
      CustomDatabaseError
    );
  });
});
