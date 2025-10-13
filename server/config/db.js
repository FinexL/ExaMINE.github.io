const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err);
    return;
  }

  console.log("Connected to MySQL");

  
  db.query("SET time_zone = '+08:00'", (err) => {
    if (err) console.error("Failed to set time zone:", err);
    else console.log("MySQL time zone set to +08:00");
  });
});

module.exports = db;
