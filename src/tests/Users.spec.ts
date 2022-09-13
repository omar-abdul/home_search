import chai from "chai";
import * as userController from "../controller/user_controller";
import { UserObject } from "../data-access/repositories/user_model";

const expect = chai.expect;

describe("User Functions", () => {
  let user_id: string = "";
  let token: string = "";

  it("*******registers/adds a user", async () => {
    const user: UserObject = {
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
    const added = await userController.addUser(user);
    user_id = added.data;

    expect(added?.data).to.be.a("string");
    expect(added.success).to.be.true;
    expect(added.err).to.be.null;
  });
  it("***********signs a user in ", async () => {
    const user = {
      phoneNumber: 5444,
      password: "somepassword",
    };

    const signIn = await userController.loginHandler(user);
    token = signIn.data;
    expect(signIn?.success).to.be.true;
    expect(signIn?.data).to.be.a("string");
    expect(signIn?.err).to.be.null;
  });

  it("******* Get User ", async () => {
    const user = await userController.getUserById(user_id);
    expect(user.data).to.be.an("object");
    expect(user.data.id).to.be.a("string");
  });

  it("****** Get user from session ID", async () => {
    const user = await userController.getUserFromSessionId(token);
    expect(user.success).to.be.true;
    expect(user.data).to.be.an("object");
    expect(user.data.id).to.equal(
      user_id,
      "User Id not equal to token user_id"
    );
  });
  it("******** deactivate user", async () => {
    const user = await userController.deactivateUser(user_id);
    expect(user.data).to.be.a("string");
    expect(user.success).to.be.true;
  });
  it("***** Delete user", async () => {
    const del = await userController.removeUser(user_id);
    expect(del?.success).to.be.true;
    expect(del?.data).to.be.a("string");
    expect(del?.err).to.be.null;
  });
});
