import chai from "chai";
import * as userController from "../controller/user_controller";
import { UserObject } from "../data-access/repositories/user_model";

const expect = chai.expect;

describe("User--", () => {
  it("registers/adds a user", async () => {
    const user: UserObject = {
      id: "test",
      phoneNumber: 5444,
      whatsappNumber: 5444,
      userName: "specialname4",
      email: "myemail3.com",
      firstName: "Mine",
      lastName: "you",
      password: "somepassword",
    };
    const added = await userController.addUser(user);
    expect(added?.data).to.be.a("string");
  });
  it("signs a user in ", async () => {
    const user = {
      phoneNumber: 5444,
      password: "somepassword",
    };

    const signIn = await userController.loginHandler(user);
    if (signIn.err) console.log(signIn.err);
    expect(signIn?.loggedIn).to.be.true;
    expect(signIn?.token).to.be.a("string");
  });
});
