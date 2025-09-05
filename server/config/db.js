const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Capstone2025",
  database: "examine_db"
});

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err);
    return;
  }

  console.log("Connected to MySQL");

  // PHilippine time zone
  db.query("SET time_zone = '+08:00'", (err) => {
    if (err) console.error("Failed to set time zone:", err);
    else console.log("MySQL time zone set to +08:00");
  });
});

module.exports = db;
