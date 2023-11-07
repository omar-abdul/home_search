import { expect } from "chai";
import request from "supertest";

import { UserObject } from "src/data-access/repositories/user_model.js";

const site = "http://localhost:8080";

describe(" API /user ", () => {
  let user: Partial<UserObject>;
  let token: string;
  beforeEach(() => {
    user = {
      userName: "myusername",
      phoneNumber: "0633388908",
      whatsappNumber: "44433333",
      email: "myemail@gmail.com",
      password: "FakePassword",
      repeatPassword: "FakePassword",
      firstName: "moi",
      lastName: "jo",
    };
  });
  describe("POST /user", function () {
    describe("/register", () => {
      it("Should register a new user", function (done) {
        request(site)
          .post("/user/register")
          .send(user)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            expect(res.body.success).to.be.true;
            expect(res.body.data).to.be.a("string");
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
      it("Should fail to register the new user due to invalid phoneNumber", function (done) {
        user.phoneNumber = "111111111111111";
        user.userName = "changedUsername";
        user.email = "changedEmail@gmail.com";
        request(site)
          .post("/user/register")
          .send(user)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            expect(res.body.success).to.be.false;
            expect(res.body.err).to.eq("Invalid SO Phone number");
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
      it("Should fail the user due to invalid email address", function (done) {
        user.userName = "changed2";
        user.email = "invalidemail";
        request(site)
          .post("/user/register")
          .send(user)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            expect(res.body.success).to.be.false;
            expect(res.body.err).to.eq("Email must be a valid email");
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
      it("Should fail due to duplicate user found", function (done) {
        request(site)
          .post("/user/register")
          .send(user)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            expect(res.body.success).to.be.false;
            expect(res.body.err).to.eq(
              "User with this phone number is already registered"
            );
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });
    });
    describe("/login", () => {
      it("Should login succesfully and return a token", function (done) {
        request(site)
          .post("/user/login")
          .send({
            phoneNumber: "0633388908",
            password: "FakePassword",
          })
          .expect((res) => {
            token = res.body.data;

            expect(res.body.data).to.be.a("string");
            expect(res.body.success).to.be.true;
          })
          .expect(200, done);
      });
      it("Should fail to login", function (done) {
        request(site)
          .post("/user/login")
          .send({
            phoneNumber: "0633388908",
            password: "FakePasswd",
          })
          .expect((res) => {
            expect(res.body.err).to.be.eq(
              "Phone Number or Password do not match"
            );
            expect(res.body.success).to.be.false;
          })
          .expect(200, done);
      });
    });
    describe("/edit/profile", function () {
      it("Should edit the profile", (done) => {
        request(site)
          .post("/user/edit/profile")
          .auth(token, { type: "bearer" })
          .send({ firstName: "Changed First Name" })
          .set("Content-Type", "application/json")
          .expect("Content-Type", /json/)
          .expect((res) => {
            expect(res.body.success).to.be.true;
            expect(res.body.data)
              .to.be.a("string")
              .and.to.eq("Update successful");
          })
          .expect(200, done);
      });
    });
  });
  describe("GET /user", function () {
    it("Should get the user info", function (done) {
      request(site)
        .get("/user/me")
        .auth(token, { type: "bearer" })
        .expect("Content-Type", /json/)
        .expect((res) => {
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.email).to.eq(user.email);
        })
        .expect(200, done);
    });
    it("Should throw forbidden error without authorization", function (done) {
      request(site).get("/user/me").expect(401, done);
    });
  });

  describe("Delete /user", function () {
    it("Should fail to delete the user  from the database", function (done) {
      request(site).delete("/user/profile/delete").expect(401, done);
    });

    it("Should delete the user  from the database", function (done) {
      request(site)
        .delete("/user/profile/delete")
        .auth(token, { type: "bearer" })
        .expect((res) => {
          expect(res.body.data)
            .to.be.a("string")
            .and.to.eq("User successfully deleted");
        })
        .expect(200, done);
    });
  });
});
