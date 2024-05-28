const express = require("express");
const app = express();
const getTopics = require("./controllers/topics.controllers.js");
const getApi = require("./controllers/api.controllers.js");
const { getArticle, getAllArticles } = require("./controllers/articles.controller.js");
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles, getAllArticles");

app.get("/api/articles/:article_id", getArticle);

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(404).send({ msg: "Not Found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
