import { expect } from "chai";
import path from "path";
import {
  HomeObject,
  ListingType,
} from "src/data-access/repositories/home_model.js";
import { UserObject } from "src/data-access/repositories/user_model.js";
import request from "supertest";

describe("API /home", () => {
  let user: Partial<UserObject>;
  let token: string;
  const site = "http://localhost:8080";
  const filePath = path.resolve("./src/tests/integration tests/testimage.jpg");

  let home: Partial<HomeObject> = {
    description: "Great home with terrace stuff wow just wow",
    roomNumbers: 5,
    price: 100,
    type: "Rent" as ListingType,
    furnish: "furnished",
    lat: 30,
    lon: 25,
  };
  beforeEach(() => {
    user = {
      firstName: "Test",
      lastName: "User",
      phoneNumber: "+252657193384",
      password: "MyPassword",
      repeatPassword: "MyPassword",
      email: "fakeemail@gmail.com",
      userName: "fakeusername",
    };
  });

  describe("#POST home", function () {
    it("Should add a home", function (done) {
      request(site)
        .post(`/user/register`)
        .send(user)
        .set("Accept", "application/json")
        .then((res) => {
          token = res.body.data;
          request(site)
            .post("/home/add-home")
            .auth(token, { type: "bearer" })
            .field("description", home.description!)
            .field("roomNumbers", home.roomNumbers!)
            .field("price", home.price!)
            .field("type", home.type!)
            .field("furnish", home.furnish!)
            .field("lat", home.lat!)
            .field("lon", home.lon!)
            .attach("home_images", filePath)
            .attach("home_images", filePath)
            .attach("home_images", filePath)
            .attach("home_images", filePath)
            .attach("home_images", filePath)

            .expect((res) => {
              expect(res.body.data).to.be.an("object");
              expect(res.body.data).to.have.property("homeId");
            })
            .expect(200, done);
        });
    });

    it("Should fail to add a home lack of authorization", function (done) {
      request(site)
        .post("/home/add-home")
        .field("description", home.description!)
        .field("roomNumbers", home.roomNumbers!)
        .field("price", home.price!)
        .field("type", home.type!)
        .field("furnish", home.furnish!)
        .field("lat", home.lat!)
        .field("lon", home.lon!)
        .attach("home_images", filePath)

        .expect(401, done);
    });

    it("Should fail to add  a home with more than 5 images", function (done) {
      request(site)
        .post("/home/add-home")
        .auth(token, { type: "bearer" })
        .field("description", home.description!)
        .field("roomNumbers", home.roomNumbers!)
        .field("price", home.price!)
        .field("type", home.type!)
        .field("furnish", home.furnish!)
        .field("lat", home.lat!)
        .field("lon", home.lon!)
        .attach("home_images", filePath)
        .attach("home_images", filePath)
        .attach("home_images", filePath)
        .attach("home_images", filePath)
        .attach("home_images", filePath)
        .attach("home_images", filePath)

        .expect((res) => {
          expect(res.body.success).to.be.false;
          expect(res.body.err).to.be.a("string");
          expect(res.body.data)
            .to.have.property("code")
            .and.to.eq("LIMIT_UNEXPECTED_FILE");
        })
        .expect(500, done);
    });

    it("Should fail to add  a home with non image file", function (done) {
      const wrongFile = path.resolve(
        "./src/tests/integration tests/testnonimage.deb"
      );
      request(site)
        .post("/home/add-home")
        .auth(token, { type: "bearer" })
        .field("description", home.description!)
        .field("roomNumbers", home.roomNumbers!)
        .field("price", home.price!)
        .field("type", home.type!)
        .field("furnish", home.furnish!)
        .field("lat", home.lat!)
        .field("lon", home.lon!)
        .attach("home_images", wrongFile)

        .expect((res) => {
          expect(res.body.success).to.be.false;
          expect(res.body.err)
            .to.be.a("string")
            .and.to.eq("Only image files are allowed");
        })
        .expect(400, done);
    });

    it("Should fail to add  a home with no description", function (done) {
      request(site)
        .post("/home/add-home")
        .auth(token, { type: "bearer" })
        .field("description", "")
        .field("roomNumbers", home.roomNumbers!)
        .field("price", home.price!)
        .field("type", home.type!)
        .field("furnish", home.furnish!)
        .field("lat", home.lat!)
        .field("lon", home.lon!)
        .attach("home_images", filePath)

        .expect((res) => {
          expect(res.body.success).to.be.false;
          expect(res.body.err).to.be.a("string");
        })
        .expect(400, done);
    });

    it("Should fail to add  a home with 0 or no room numbers", function (done) {
      request(site)
        .post("/home/add-home")
        .auth(token, { type: "bearer" })
        .field("description", home.description!)
        .field("roomNumbers", 0)
        .field("price", home.price!)
        .field("type", home.type!)
        .field("furnish", home.furnish!)
        .field("lat", home.lat!)
        .field("lon", home.lon!)
        .attach("home_images", filePath)

        .expect((res) => {
          expect(res.body.success).to.be.false;
          expect(res.body.err).to.be.a("string");
        })
        .expect(400, done);
    });

    it("Should fail to add  a home with no location", function (done) {
      request(site)
        .post("/home/add-home")
        .auth(token, { type: "bearer" })
        .field("description", "")
        .field("roomNumbers", home.roomNumbers!)
        .field("price", home.price!)
        .field("type", home.type!)
        .field("furnish", home.furnish!)
        .attach("home_images", filePath)

        .expect((res) => {
          expect(res.body.success).to.be.false;
          expect(res.body.err).to.be.a("string");
        })
        .expect(400, done);
    });
  });

  describe("#GET home", function () {});
});
