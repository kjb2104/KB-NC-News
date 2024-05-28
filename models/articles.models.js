const db = require('../db/connection.js')

function selectAllArticles(){





}

function selectArticleById(article_id){
    return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {

      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return result.rows[0];
    });
}


module.exports = { selectArticleById, selectAllArticles }