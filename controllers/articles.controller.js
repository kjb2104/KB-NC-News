const {selectArticleById, selectAllArticles } = require('../models/articles.models.js')


function getAllArticles(){

selectAllArticles().then((articles) => {
  res.status(200).send({articles})
})
}

function getArticle(req, res, next){
    const { article_id } = req.params

    selectArticleById(article_id).then((article) => {
      res.status(200).send({article });
    }).catch((next))
}


module.exports = { getArticle, getAllArticles }