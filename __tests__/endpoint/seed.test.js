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
describe("/api/users", () => {
  test("should GET: 200 sends an array of all of the users as an object with three keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toHaveLength(4);
        response.body.users.forEach((user) => {
          expect(typeof user.name).toBe("string");
          expect(typeof user.username).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
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
        expect(response.body.msg).toBe("Not a valid input");
      });
  });
  test("GET: 200 sends an array of all of the articles as an object with two keys", () => {
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
          expect(typeof article.comment_count).toBe("number");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
    })

      test("GET: 200 sends an array of all of the articles filtered by the queried for topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((response) => {
            const { articles } = response.body;
            expect(articles).toHaveLength(1);
            articles.forEach((article) => {
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("number");
            });
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
  });
  test("GET:400 responds with an appropriate error message when passed an invalid query", () => {
    return request(app)
      .get("/api/articles?topic=yoshi")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not a valid query");
      });
  });
  test("GET:404 responds with an appropriate error message when passed a valid query that doesn't have any articles about it in the database", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("No articles available for this topic");
      });
  });
  test("PATCH: 201 updates an existing article by updating the votes property and responds with the updated article", () => {
    const newPatch = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newPatch)
      .expect(201)
      .then((response) => {
        const { article } = response.body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:400 sends an appropriate status and error message when given an invalid id", () => {
    const newPatch = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/platypus")
      .send(newPatch)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Not a valid input");
      });
  });
  test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    const newPatch = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/9423")
      .send(newPatch)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article id is not found");
      });
  });
  test("PATCH:400 responds with an appropriate status and error message when provided with a bad patch request that does not provide datatypes that align with the database's expectations", () => {
    const newPatch = {
      inc_votes: "five",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newPatch)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Not a valid input");
      });
  });
  test("PATCH:400 responds with an appropriate status and error message when provided with a bad patch that is not structured correctly", () => {
    const newPatch = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newPatch)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Input not structured correctly");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments belonging to a requested-for article_id to the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 sends an appropriate status and an empty array when passed an ID which does not have any comments", () => {
    return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments.comments).toEqual([]);
      });
  });
  test("POST:201 inserts a new comment to the db and sends the new comment back to the client", () => {
    const newComment = {
      body: "Eloquent platypi",
      author: "icellusedkars",
      article_id: 1,
      votes: 2,
      created_at: "2020-01-01T03:08:00.000Z",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.article_id).toBe(1);
        expect(response.body.comment.author).toBe("icellusedkars");
        expect(response.body.comment.votes).toBe(2);
        expect(response.body.comment.created_at).toBe(
          "2020-01-01T03:08:00.000Z"
        );
        expect(response.body.comment.body).toBe("Eloquent platypi");
      });
  });

  test("POST:400 responds with an appropriate status and error message when provided with a bad comment that does not provide datatypes that align with the database's expectations", () => {
    const newComment = {
      body: false,
      author: "icellusedkars",
      article_id: 1,
      votes: "ketchup",
      created_at: "2020-01-01T03:08:00.000Z",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Not a valid input");
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with a bad comment that is not structured correctly", () => {
    const newComment = {
      author: "icellusedkars",
      article_id: 1,
      votes: 2,
      created_at: "2020-01-01T03:08:00.000Z",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Input not structured correctly");
      });
  });
  test("POST:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9656/comments")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Article id is not found");
      });
  });
  test("POST:400 responds with an appropriate error message when given an invalid id", () => {
    const newComment = {
      body: "Eloquent platypi",
      author: "icellusedkars",
      article_id: 1,
      votes: 2,
      created_at: "2020-01-01T03:08:00.000Z",
    };
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not a valid input");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9785/comments")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Article id is not found");
      });
  });
  test("GET:400 responds with an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Not a valid input");
      });
  });
});

describe("/api/comments", () => {
  test("DELETE: 204 deletes the specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE:400 responds with an appropriate status and error message when given a non-existent comment id", () => {
    return request(app)
      .delete("/api/comments/discombobulated")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Not a valid input");
      });
  });
  test("DELETE:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        const { msg } = response.body;
        expect(msg).toBe("Comment Id is not found");
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
