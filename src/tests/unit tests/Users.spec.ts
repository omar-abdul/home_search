import chai, { assert } from "chai";
import sinon from "sinon";
import * as argon from "argon2";
import * as userController from "../../controller/user_controller";
import { UserObject } from "../../data-access/repositories/user_model";
import {
  CustomDatabaseError,
  LoginFailureError,
  ResourceNotFoundError,
  UserInputError,
  ValidationError,
} from "../../lib/customerrors";
import chaiAsPromised from "chai-as-promised";
import UserRepo from "src/data-access/repositories/user_repository";
import crypto, { BinaryLike } from "crypto";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("User Functions", () => {
  let user: UserObject;

  beforeEach(() => {
    (user as any) = {
      phoneNumber: "75432567",
      whatsappNumber: "11111111",
      userName: "special",
      email: "my@gmail.com",
      firstName: "Mine",
      lastName: "you",
      password: "Somepassword",
      repeatPassword: "Somepassword",
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
      const sessHStub = sinon
        .stub(userController, "loginHandler")
        .resolves({ err: null, data: "FakesessionID" });
      sinon.stub(UserRepo.prototype, "getUserByNumber").resolves([]);
      const { err, data } = await userController.addUser(user);
      expect(data).to.be.a("string").length.greaterThan(0);
      expect(err).to.be.null;
    });
    it("Should return UserInputError on duplicate user", async function () {
      const user_stub = sinon
        .stub(UserRepo.prototype, "getUserByNumber")
        .resolves([user]);
      const { err, data } = await userController.addUser(user);
      expect(err).to.be.instanceOf(UserInputError);
      expect(data).to.be.null;
    });
  });

  describe("Login User", function () {
    it("Should return a token for a successful login", async function () {
      user.salt = "fakesalt";
      // user.password = crypto
      //   .pbkdf2Sync(user.password, user.salt, 1000, 64, "sha512")
      //   .toString("hex");
      user.password = await argon.hash(user.password);

      const user_stub = sinon
        .stub(UserRepo.prototype, "getUserByNumber")
        .resolves([user]);
      const session_stub = sinon
        .stub(UserRepo.prototype, "addUserSession")
        .resolves([{ sessionId: "fakesessionId" }]);
      const { phoneNumber } = user;
      const { err, data } = await userController.loginHandler({
        phoneNumber,
        password: "Somepassword",
      });

      expect(data).to.be.a("string");
      expect(data).length.to.be.greaterThan(0);
      expect(err).to.be.null;
    });

    it("Should return an error  for wrong password", async function () {
      user.salt = "fakesalt";
      // user.password = crypto
      //   .pbkdf2Sync(user.password, user.salt, 1000, 64, "sha512")
      //   .toString("hex");
      user.password = await argon.hash(user.password);
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

      const { err, data } = await userController.loginHandler({
        phoneNumber: "2342",
        password: "somepassword",
      });

      expect(err).to.be.an.instanceOf(LoginFailureError);
      expect(err?.message).length.to.be.greaterThan(0);
      expect(data).to.be.null;
    });
  });

  describe("User Sessions", function () {
    it("Should get user object from sessionId", async function () {
      const user_sess = sinon
        .stub(UserRepo.prototype, "getUserFromSessionId")
        .resolves([user]);
      const { err, data } = await userController.getUserFromSessionId(
        "fakesessionId"
      );

      expect(data).to.be.an("object");
      expect(Object.keys(data)).length.to.be.greaterThan(0);
      expect(user_sess.calledOnceWith("fakesessionId")).to.be.true;
    });

    it("Should throw a ResourceNotFoundError", async function () {
      const user_sess = sinon
        .stub(UserRepo.prototype, "getUserFromSessionId")
        .resolves([]);
      const { err, data } = await userController.getUserFromSessionId(
        "fakesessId"
      );
      expect(data).to.be.null;
      expect(err).to.be.instanceOf(ResourceNotFoundError);
      expect(user_sess.calledOnceWith("fakesessId")).to.be.true;
    });
  });
  describe("Deactivate User", function () {
    it("Should deactivate the user and remove all active user sessions", async function () {
      const user_sess = sinon
        .stub(UserRepo.prototype, "deactivateUser")
        .resolves([{ id: "fakeId" }]);
      const del_stub = sinon
        .stub(UserRepo.prototype, "deleteAllUserSessions")
        .resolves(1);
      const { err, data } = await userController.deactivateUser("fakeId");
      expect(data).to.be.a("string");
      expect(err).to.be.null;
      expect(user_sess.calledOnceWith("fakeId")).to.be.true;
      expect(del_stub.calledOnceWith("fakeId")).to.be.true;
    });

    it("Should throw ResourceNotFoundError ", async function () {
      const user_sess = sinon
        .stub(UserRepo.prototype, "deactivateUser")
        .resolves([]);
      const del_stub = sinon
        .stub(UserRepo.prototype, "deleteAllUserSessions")
        .resolves(0);
      const { err, data } = await userController.deactivateUser("nonexFakeId");
      expect(data).to.be.null;
      expect(err).to.be.instanceOf(ResourceNotFoundError);
      expect(user_sess.calledOnceWith("nonexFakeId")).to.be.true;
      expect(del_stub.neverCalledWith("nonexFakeId")).to.be.true;
    });
  });

  describe("Delete/Remove User", function () {
    it("Should delete the user with id", async function () {
      const user_sess = sinon.stub(UserRepo.prototype, "delUser").resolves(1);
      const { err, data } = await userController.removeUser("fakeId");
      expect(data).to.be.a("string");
      expect(err).to.be.null;
      expect(user_sess.called).to.be.true;
    });
    it("Should throw a ResourceNotFoundError", async function () {
      // const user_sess = sinon.stub(UserRepo.prototype, "delUser").resolves(0);
      const { err, data } = await userController.removeUser("");

      expect(err).to.be.instanceOf(CustomDatabaseError);
      //expect(user_sess.called).to.be.true;
      expect(data).to.be.null;
    });
    it("Should throw ResourceNotFoundError when no rows are affected", async function () {
      const user_sess = sinon.stub(UserRepo.prototype, "delUser").resolves(0);
      const { err, data } = await userController.removeUser("nonexistentid");
      expect(err).to.be.instanceOf(ResourceNotFoundError);
      expect(data).to.be.null;
    });
  });
  describe("Update user", function () {
    it("Should update the user", async function () {
      const user_stub = sinon
        .stub(UserRepo.prototype, "updateUser")
        .resolves(1);
      const { err, data } = await userController.updateUser("fakeid", {
        phoneNumber: "333",
      });
      expect(data).to.be.a("string");
      expect(err).to.be.null;
    });

    it("Should throw a validation error", async function () {
      const { err, data } = await userController.updateUser("fakeid", {
        email: "incorrectemail",
      });
      expect(err).to.be.instanceOf(ResourceNotFoundError);
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
