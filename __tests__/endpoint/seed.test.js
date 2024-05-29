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

describe("/api/articles", () => {
  test("GET:200 sends a single article to the client that has the requested-for id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect;
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9993423")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article id is not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/platypus")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Article id does not exist");
      });
  });
  test("should GET: 200 sends an array of all of the articles as an object with two keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
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
        if (vals.length > 0) {
          vals.forEach((obj) => {
            expect(typeof obj.description).toBe("string");
            expect(Array.isArray(obj.queries)).toBe(true);
            expect(typeof obj.exampleResponse).toBe("object");
          });
        }
      });
  });
});

describe("/api/*", () => {
  test("should GET: 404 responds with an error message not found when passed a route that does not exist", () => {
    return request(app)
      .get("/api/topiczz")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not Found");
      });
  });
});
