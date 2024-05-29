const {
  selectArticleById,
  selectAllArticles,
} = require("../models/articles.models.js");

function getAllArticles(req, res, next) {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  }).catch((err) => 
  {
  console.log(err)
  })
}

function getArticle(req, res, next) {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = { getArticle, getAllArticles };
