const db = require("../db/connection.js");

function selectAllArticles() {
  return db
    .query(
      "SELECT articles.*, count(comments.article_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
}

function selectArticleById(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article id is not found" });
      }
      return result.rows[0];
    });
}

function selectArticleComments(article_id) {
  return db
    .query(
      "Select * FROM comments WHERE article_id = $1 ORDER BY created_at DESC ",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 200, msg: [] });
      }
      return result.rows;
    });
}

function checkArticleID(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      if (result.rows === 0) {
        return Promise.reject({ status: 404, msg: "Article id is not found" });
      }
      return result.rows;
    });
}

module.exports = {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleID,
};
