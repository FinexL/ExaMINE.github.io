const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE user_name = ? AND user_status = 'Active'",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error", error: err.message });
      if (rows.length === 0) return res.status(400).json("Invalid username or password");

      const user = rows[0];

      bcrypt.compare(password, user.user_password, (err, validPassword) => {
        if (err) return res.status(500).json("Password check failed");
        if (!validPassword) return res.status(400).json("Invalid username or password");

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        db.query(
          "INSERT INTO refresh_tokens (user_id, token, expiry) VALUES (?, ?, ?)",
          [user.user_id, refreshToken, expiryDate]
        );

        db.query("UPDATE users SET last_login = NOW() WHERE user_id = ?", [user.user_id]);

        res.json({
          id: user.user_id,
          username: user.user_name,
          role: user.user_role,
          accessToken,
          refreshToken,
        });
      });
    }
  );
};

exports.refresh = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json("No refresh token provided");

  db.query(
    "SELECT * FROM refresh_tokens WHERE token = ? AND expiry > NOW()",
    [refreshToken],
    (err, rows) => {
      if (err) return res.status(500).json("Database error");
      if (rows.length === 0) return res.status(403).json("Invalid refresh token");

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json("Invalid refresh token");

        db.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        db.query(
          "INSERT INTO refresh_tokens (user_id, token, expiry) VALUES (?, ?, ?)",
          [user.id, newRefreshToken, expiryDate]
        );

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
      });
    }
  );
};

exports.logout = (req, res) => {
  const refreshToken = req.body.token;
  db.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken], (err) => {
    if (err) return res.status(500).json("Error logging out");
    res.json("Logged out successfully");
  });
};
