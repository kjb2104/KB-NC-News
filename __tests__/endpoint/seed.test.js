const request = require("supertest");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../../db/data/test-data/index.js");
const app = require("../../app.js");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("should GET: 200 sends an array of all of the topics as an object with two keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toHaveLength(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("should GET: 200 responds with an object which describes all the endpoints on this API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const parsedResponse = JSON.parse(response.text);
        const vals = Object.values(parsedResponse);
        vals.forEach((obj) => {
          expect(typeof obj.description).toBe("string");
          expect(Array.isArray(obj.queries)).toBe(true);
          expect(typeof obj.exampleResponse).toBe("object");
        });
      });
  });
});

describe("/api/*", () => {
  test("should GET: 404 responds with an error message not found when passed a route that does not exist", () => {
    return request(app)
      .get("/api/topiczz")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});
