import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

import db from "../../data-access/config/db";
import mig from "../../data-access/migrations/home_migrations";
import { tableExists } from "../../lib/util";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Database  Migrations", () => {
  describe("Down", () => {
    it("Will destory all tables in the database", async () => {
      return mig.down(db).then(async () => {
        const homeExists = await tableExists(db, "homes");
        const usersExist = await tableExists(db, "users");
        expect(usersExist).to.be.false;
        expect(homeExists).to.be.false;
      });
    });
  });
  describe("Check Up", () => {
    it("Creates all the tables from the migration file", async () => {
      return mig.up(db).then(async () => {
        const userExists = await tableExists(db, "users");
        const homeExists = await tableExists(db, "homes");
        expect(userExists).to.be.true;
        expect(homeExists).to.be.true;
      });
    });
  });
});
