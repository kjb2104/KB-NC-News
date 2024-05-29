const express = require("express");
const app = express();
const getTopics = require("./controllers/topics.controllers.js");
const getApi = require("./controllers/api.controllers.js");
const {
  getArticle,
  getAllArticles,
  getArticleComments,
} = require("./controllers/articles.controller.js");
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.use((err, req, res, next) => {
  if (err.msg === "Article id is not found") {
    res.status(404).send({ msg: "Article id is not found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Input does not exist" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 200) {
    res.status(200).send([]);
  }
  next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
