const db = require("../config/db");

const createUser = (name, email, password, role, callback) => {
  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, password, role],
    (err, result) => {
      callback(err, result);
    }
  );
};

const findUserByEmail = (email, callback) => {
  const sql = `
    SELECT * FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], (err, results) => {
    callback(err, results);
  });
};

module.exports = {
  createUser,
  findUserByEmail,
};