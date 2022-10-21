import { CustomDatabaseError } from "@lib/customerrors";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as placesController from "../controller/place_controller";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Nearby places functionality, places near homes and vice versa", () => {
  describe("Adding a new location with coordinates", () => {
    it("Should add a new location", async () => {
      let place = {
        name: "Mahad school of life",
        lat: 0,
        lon: 0,
      };
      const { err, data } = await placesController.addPlace(place);
      expect(err).to.be.null;
    });
    it("Should fail to add a new location", async () => {
      let place = {
        name: "Another sc",
        lat: 0,
        lon: -500,
      };
      const { err, data } = await placesController.addPlace(place);
      expect(err).to.be.instanceOf(Error);
    });
  });
  describe("Update home_nearby_places table with proximity of 3km to all homes", function () {
    it("Should update the home_nearby_place table", async function () {});
  });
});
