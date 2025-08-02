const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Capstone2025",
  database: "examine_db"
});

module.exports = db;