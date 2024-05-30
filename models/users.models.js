const db = require("../db/connection.js");

function selectUsers() {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
}

module.exports = selectUsers;
