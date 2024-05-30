const { promises } = require("supertest/lib/test.js");
const {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleID,
  insertComment,
  updateArticle,
  checkCommentId,
  removeCommentById,
} = require("../models/articles.models.js");

function getAllArticles(req, res, next) {
  const { topic } = req.query;
  selectAllArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticle(req, res, next) {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticleComments(req, res, next) {
  const { article_id } = req.params;
  return Promise.all([
    checkArticleID(article_id),
    selectArticleComments(article_id),
  ])
    .then((result) => {
      if (result[0].length === 0) {
        res.status(404).send({ msg: "Article id is not found" });
      }
      const comments = result[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticleComment(req, res, next) {
  const { article_id } = req.params;
  const { body } = req;

  return Promise.all([checkArticleID(article_id), insertComment(body)])
    .then((result) => {
      const comment = result[1];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const { body } = req;
  const { article_id } = req.params;

  return Promise.all([
    checkArticleID(article_id),
    updateArticle(article_id, body),
  ])
    .then((result) => {
      const article = result[1][0];
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;

  return Promise.all([
    checkCommentId(comment_id),
    removeCommentById(comment_id),
  ])
    .then((result) => {
      return res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticle,
  getAllArticles,
  getArticleComments,
  postArticleComment,
  patchArticle,
  deleteComment,
};
