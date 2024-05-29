const {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleID,
} = require("../models/articles.models.js");

function getAllArticles(req, res, next) {
  selectAllArticles()
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

  checkArticleID(article_id)
    .then((result) => {
      if (result.length > 0) {
        selectArticleComments(article_id)
          .then((result) => {
            const comments = result;
            res.status(200).send({ comments });
          })
          .catch(next);
      } else {
        res.status(404).send({ msg: "Article id is not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
}
module.exports = { getArticle, getAllArticles, getArticleComments };
