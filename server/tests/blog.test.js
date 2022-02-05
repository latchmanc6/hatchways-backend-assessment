// import supertest from "supertest";
// import router from "../routes/blogRoutes";
const supertest = require("supertest");
const router = require("../routes/blogRoutes");

describe("GET /api/ping", () => {
  describe("testing if ping status code is correct (200)", () => {
    test("should respond with 200 status code", async () => {
        const response = await supertest.request(router).get("/ping");
        expect(response.statusCode).toBe(200);
    });
  });

//   describe("testing if ping status code is incorrect", () => {});
});
