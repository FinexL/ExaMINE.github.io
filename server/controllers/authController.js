const db = require("../config/db");
const { generateAccessToken } = require("../utils/token");
const { comparePassword } = require("../utils/hash");

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE user_name = ? AND user_status = 'Active'",
    [username],
    async (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      if (rows.length === 0)
        return res
          .status(400)
          .json({ message: "Invalid username or password" });

      const user = rows[0];
      const validPassword = await comparePassword(password, user.user_password);
      if (!validPassword)
        return res
          .status(400)
          .json({ message: "Invalid username or password" });

      // generate 2-day access token
      const accessToken = generateAccessToken(user);

      // set HttpOnly cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // set true if productive na(https)
        sameSite: "Lax",
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      });

      // Update last_login and last_activity
      db.query(
        "UPDATE users SET last_login = NOW(), last_activity = NOW() WHERE user_id = ?",
        [user.user_id]
      );

      // return basic user info (not password)
      res.json({
        id: user.user_id,
        username: user.user_name,
        role: user.user_role,
      });
    }
  );
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
};
