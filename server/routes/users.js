 const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const query = `
    SELECT 
      user_id,
      user_name,
      user_role,
      user_status,
      user_email,
      DATE_FORMAT(add_date, '%Y-%m-%d') AS add_date,
      DATE_FORMAT(last_login, '%Y-%m-%d') AS last_login
    FROM users
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
