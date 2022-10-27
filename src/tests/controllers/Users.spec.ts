import chai, { assert } from "chai";
import sinon from "sinon";
import * as userController from "../../controller/user_controller";
import { UserObject } from "../../data-access/repositories/user_model";
import { CustomDatabaseError, LoginFailureError } from "@lib/customerrors";
import chaiAsPromised from "chai-as-promised";
import UserRepo from "src/data-access/repositories/user_repository";
import crypto, { BinaryLike } from "crypto";
import e from "express";
const expect = chai.expect;
chai.use(chaiAsPromised);

describe("User Functions", () => {
  let user: UserObject;

  beforeEach(() => {
    user = {
      id: "",
      phoneNumber: 1111,
      whatsappNumber: 1111,
      userName: "special",
      email: "my.com",
      firstName: "Mine",
      lastName: "you",
      password: "somepassword",
      active: true,
      salt: "",
    };
  });
  afterEach(() => {
    sinon.restore();
  });

  describe("Add user", function () {
    it("Should add the user", async function () {
      const user_stub = sinon
        .stub(UserRepo.prototype, "addUser")
        .resolves([user]);
      const { err, data } = await userController.addUser(user);

      expect(data).to.be.a("string").to.not.be.empty;
    });
    it("Should return CustomDatabaseError on duplicate user", async function () {
      const user_stub = sinon
        .stub(UserRepo.prototype, "addUser")
        .throws(() => new CustomDatabaseError("Phone Number already exists"));
      const { err, data } = await userController.addUser(user);
      expect(err).to.be.instanceOf(CustomDatabaseError);
    });
  });

  describe("Login User", function () {
    it("Should return a token for a successful login", async function () {
      user.salt = "fakesalt";
      user.password = crypto
        .pbkdf2Sync(user.password, user.salt, 1000, 64, "sha512")
        .toString("hex");

      const user_stub = sinon
        .stub(UserRepo.prototype, "getUserByNumber")
        .resolves([user]);
      const session_stub = sinon
        .stub(UserRepo.prototype, "addUserSession")
        .resolves([{ sessionId: "fakesessionId" }]);
      const { phoneNumber } = user;
      const { err, data } = await userController.loginHandler({
        phoneNumber,
        password: "somepassword",
      });

      expect(data).to.be.a("string");
      expect(data).length.to.be.greaterThan(0);
      expect(err).to.be.null;
    });

    it("Should return an error  for wrong password", async function () {
      user.salt = "fakesalt";
      user.password = crypto
        .pbkdf2Sync(user.password, user.salt, 1000, 64, "sha512")
        .toString("hex");

      const user_stub = sinon
        .stub(UserRepo.prototype, "getUserByNumber")
        .resolves([user]);
      const session_stub = sinon
        .stub(UserRepo.prototype, "addUserSession")
        .resolves([{ sessionId: "fakesessionId" }]);
      const { phoneNumber } = user;
      const { err, data } = await userController.loginHandler({
        phoneNumber,
        password: "incorrectpassword",
      });

      expect(err).to.be.an.instanceOf(LoginFailureError);
      expect(err?.message).length.to.be.greaterThan(0);
      expect(data).to.be.null;
    });

    it("Should return an error  for wrong phoneNumber", async function () {
      user.salt = "fakesalt";
      user.password = crypto
        .pbkdf2Sync(user.password, user.salt, 1000, 64, "sha512")
        .toString("hex");

      const user_stub = sinon
        .stub(UserRepo.prototype, "getUserByNumber")
        .resolves([]);
      const session_stub = sinon
        .stub(UserRepo.prototype, "addUserSession")
        .resolves([{ sessionId: "fakesessionId" }]);
      const { phoneNumber } = user;
      const { err, data } = await userController.loginHandler({
        phoneNumber: 2342,
        password: "somepassword",
      });

      expect(err).to.be.an.instanceOf(LoginFailureError);
      expect(err?.message).length.to.be.greaterThan(0);
      expect(data).to.be.null;
    });
  });

  //   let user_id: string = "";
  //   let token: string = "";

  //   it("*****registers/adds a user", async () => {
  //     const user: UserObject = {

  //     };
  //     const added = await userController.addUser(user);
  //     user_id = added.data;

  //     expect(added?.data).to.be.a("string");
  //     expect(added.err).to.be.null;
  //   });
  //   it("*****signs a user in ", async () => {
  //     const user = {
  //       phoneNumber: 1111,
  //       password: "somepassword",
  //     };

  //     const signIn = await userController.loginHandler(user);
  //     token = signIn.data;

  //     expect(signIn?.data).to.be.a("string");
  //     expect(signIn?.err).to.be.null;
  //   });
  //   it("*****Should fail to login when invalid credentials are passed", async () => {
  //     const user = {
  //       phoneNumber: 5444,
  //       password: "33333",
  //     };
  //     const { err, data } = await userController.loginHandler(user);
  //     expect(err).to.be.instanceOf(LoginFailureError);
  //     expect(data).to.be.null;
  //   });

  //   it("*****Should get user by ID ", async () => {
  //     const user = await userController.getUserById(user_id);
  //     expect(user.data).to.be.an("object");
  //     expect(user.data.id).to.be.a("string");
  //   });

  //   it("*****Get user from session ID", async () => {
  //     const user = await userController.getUserFromSessionId(token);

  //     expect(user.data).to.be.an("object");
  //     expect(user.data.id).to.equal(
  //       user_id,
  //       "User Id not equal to token user_id"
  //     );
  //   });
  //   it("*****Should deactivate a user", async () => {
  //     const user = await userController.deactivateUser(user_id);
  //     expect(user.data).to.be.a("string");
  //     // expect(user.success).to.be.true;
  //   });
  //   it("*****Should Delete user", async () => {
  //     const del = await userController.removeUser(user_id);
  //     // expect(del?.success).to.be.true;
  //     expect(del?.data).to.be.a("string");
  //     expect(del?.err).to.be.null;
  //   });
});
