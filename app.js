const express = require("express");
const app = express();
const getTopics = require("./controllers/topics.controllers.js");
const getApi = require("./controllers/api.controllers.js");
const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postArticleComment,
  patchArticle,
} = require("./controllers/articles.controller.js");
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticle),
  app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(404).send({ msg: "Article id is not found" });
    }
    next(err);
  });

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Not a valid input" });
  }
  next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
