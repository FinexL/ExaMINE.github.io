const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    // Check last activity from DB
    db.query(
      "SELECT last_activity FROM users WHERE user_id = ?",
      [user.id],
      (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (rows.length === 0)
          return res.status(401).json({ message: "User not found" });

        const lastActivity = new Date(rows[0].last_activity);
        const now = new Date();
        const diffHours = (now - lastActivity) / (1000 * 60 * 60);

        if (diffHours > 12) {
          return res
            .status(401)
            .json({ message: "Session expired due to inactivity" });
        }

        // Update last_activity
        db.query("UPDATE users SET last_activity = NOW() WHERE user_id = ?", [
          user.id,
        ]);

        req.user = user;
        next();
      }
    );
  });
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient rights" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
