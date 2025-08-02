const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/", (req, res) => {
  const { user_email, user_password } = req.body;

  const query = "SELECT * FROM users WHERE user_email = ?";
  db.query(query, [user_email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    bcrypt.compare(user_password, user.user_password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const payload = {
        user_id: user.user_id,
        user_name: user.user_name,
        user_role: user.user_role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      // Update last_login
      db.query("UPDATE users SET last_login = NOW() WHERE user_id = ?", [user.user_id]);

      res.json({ message: "Login successful", token });
    });
  });
});

module.exports = router;
