const { promises } = require("supertest/lib/test.js");
const db = require("../db/connection.js");

function selectAllArticles(topic) {
  const possibleQueries = ["football", "coding", "cooking", "cats", "paper", "mitch"];

  if (topic && !possibleQueries.includes(topic)) {
    return Promise.reject({ status: 404, msg: "Not a valid query" });
  }

  let queryVals = [];

  let sqlString =
    "SELECT articles.*, count(comments.article_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";
  let endString = " GROUP BY articles.article_id ORDER BY created_at DESC";

  if (topic) {
    sqlString += " WHERE topic = $1";
    queryVals.push(topic);
    const finalStr = (sqlString += endString);
    return db.query(finalStr, queryVals).then((result) => {
    
      return result.rows;
    });
  }

  const finalStr = (sqlString += endString);

  return db.query(finalStr).then((result) => {
    return result.rows;
  });
}

function selectArticleById(article_id) {
  return db
    .query(
      "SELECT articles.*, count(comments.article_id) :: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
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
      return result.rows;
    });
}

function checkArticleID(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article id is not found" });
      }
      return result.rows;
    });
}

function insertComment(body) {
  return db
    .query(
      "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [body.body, body.author, body.article_id, body.votes, body.created_at]
    )
    .then((result) => {
      const body = result.rows[0];
      return body;
    });
}

function updateArticle(article_id, body) {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [body.inc_votes, article_id]
    )
    .then((result) => {
      return result.rows;
    });
}
function checkCommentId(comment_id) {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Id is not found" });
      }
      return result.rows;
    });
  P;
}

function removeCommentById(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      return result.rowCount;
    });
}
module.exports = {
  selectArticleById,
  selectAllArticles,
  selectArticleComments,
  checkArticleID,
  insertComment,
  updateArticle,
  checkCommentId,
  removeCommentById,
};
