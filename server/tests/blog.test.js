const supertest = require("supertest");
const app = require("../index");
const request = supertest(app);

// GET /api/ping TEST
describe("GET /api/ping", () => {
  describe("testing if ping status code is correct (200)", () => {
    test("should respond with 200 status code", async () => {
      const response = await request.get("/api/ping");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("testing if body of request is correct", () => {
    test("should respond with an object {'success': true}", async () => {
      const response = await request.get("/api/ping");
      expect(response.body).toEqual({ success: true });
    });
  });
});

// GET /api/posts/:tags/:sortBy?/:direction? TEST
describe("GET /api/posts/:tags/:sortBy?/:direction?", () => {
  describe("testing if status code is correct (200)", () => {
    test("should respond with 200 status code", async () => {
      const response = await request.get("/api/posts/tech");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("testing if correct status code is shown when an invalid tag value is entered", () => {
    test("should respond with 400 status code", async () => {
      const response = await request.get("/api/posts/ /likes?direction=desc");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("testing if correct error + message when an invalid tag value is entered", () => {
    test("should respond with 'Sort by parameter is invalid'", async () => {
      const response = await request.get("/api/posts/ /likes?direction=desc");
      expect(response.body).toEqual({ error: "Tags parameter is required" });
    });
  });

  describe("testing if correct status code is shown when an invalid sortBy value is entered", () => {
    test("should respond with 400 status code", async () => {
      const response = await request.get("/api/posts/tech?sortBy=dogs");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("testing if correct error + message when an invalid sortBy value is entered", () => {
    test("should respond with 'Sort by parameter is invalid'", async () => {
      const response = await request.get("/api/posts/tech?sortBy=dogs");
      expect(response.body).toEqual({ error: "Sort by parameter is invalid" });
    });
  });

  describe("testing if correct status code is shown when an invalid direction value is entered", () => {
    test("should respond with 400 status code", async () => {
      const response = await request.get("/api/posts/tech?direction=down");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("testing if correct error + message when an invalid direction value is entered", () => {
    test("should respond with 'Direction parameter is invalid'", async () => {
      const response = await request.get("/api/posts/tech?direction=down");
      expect(response.body).toEqual({
        error: "Direction parameter is invalid",
      });
    });
  });

  describe("testing if default sortBy and direction are working correctly", () => {
    test("the returned posts should be sorted by id and in ascending direction", async () => {
      const response = await request.get("/api/posts/tech");
      let idArray = [];
      response.body.posts.forEach((post) => {
        idArray.push(parseInt(post.id));
      });
      expect(
        idArray.reduce((n, item) => n !== false && item >= n && item)
      ).toBeTruthy();
    });
  });

  describe("testing that api can have multiple tags and work as intended", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request.get("/api/posts/tech,health,history");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("testing if all posts retrieved are unique", () => {
    test("should provide a list of unique posts (ids)", async () => {
      const response = await request.get("/api/posts/tech,health,history");
      let idArray = [];
      response.body.posts.forEach((post) => {
        idArray.push(parseInt(post.id));
      });
      expect(new Set(idArray).size === idArray.length).toBeTruthy();
    });
  });

  describe("testing if desc direction is working correctly", () => {
    test("the returned posts should be sorted by in descending direction", async () => {
      const response = await request.get(
        "/api/posts/tech?sortBy=likes&direction=desc"
      );
      let idArray = [];
      response.body.posts.forEach((post) => {
        idArray.push(parseInt(post.id));
      });
      expect(
        idArray.reduce((n, item) => n !== true && item >= n && item)
      ).toBeTruthy();
    });
  });

  describe("testing if sortBy is working correctly", () => {
    test("the returned posts should be sorted by likes with default direction of ascending", async () => {
      const response = await request.get(
        "/api/posts/tech,history?sortBy=likes"
      );
      let idArray = [];
      response.body.posts.forEach((post) => {
        idArray.push(parseInt(post.likes));
      });
      expect(
        idArray.reduce((n, item) => n !== false && item >= n && item)
      ).toBeTruthy();
    });
  });
});
