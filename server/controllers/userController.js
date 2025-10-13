const db = require("../config/db");
const { hashPassword } = require("../utils/hash");


exports.getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT user_id, user_name, user_email, user_role, user_status, last_login FROM users WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (rows.length === 0) return res.status(404).json({ message: "User not found" });
      res.json(rows[0]);
    }
  );
};
exports.createUser = async (req, res) => {
  const { username, password, role = "User", status = "Active", email = "" } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const validRoles = ["Admin", "User"];
  const validStatuses = ["Active", "Inactive"];
  if (!validRoles.includes(role)) return res.status(400).json({ message: "Invalid role" });
  if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

  try {

    db.query(
      "SELECT * FROM users WHERE user_name = ?",
      [username],
      async (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        if (rows.length > 0) return res.status(400).json({ message: "Username already exists" });

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Insert new user
        db.query(
          "INSERT INTO users (user_name, user_email, user_password, user_role, user_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
          [username, email, hashedPassword, role, status],
          (err2, result) => {
            if (err2) return res.status(500).json({ message: "Database error", error: err2.message });
            res.status(201).json({ message: "User created successfully", userId: result.insertId });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// Get all users (Admin only)
exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT user_id, user_name, user_email, user_role, user_status, last_login FROM users",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(rows);
    }
  );
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, password, role, status } = req.body;

  // Allow Admin to edit anyone, normal users only edit themselves
  const isAdmin = req.user.role === "Admin";
  const isSelf = req.user.id == userId;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: "Forbidden: cannot edit other users" });
  }

  db.query("SELECT * FROM users WHERE user_id = ?", [userId], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!results.length) return res.status(404).json({ message: "User not found" });

    const fields = [];
    const values = [];

    // Everyone can edit username/email/password
    if (username) { fields.push("user_name = ?"); values.push(username); }
    if (email) { fields.push("user_email = ?"); values.push(email); }

    // Only Admin can edit role/status
    if (isAdmin) {
      if (role) { fields.push("user_role = ?"); values.push(role); }
      if (status) { fields.push("user_status = ?"); values.push(status); }
    }

    const doUpdate = async (hashedPassword) => {
      if (hashedPassword) {
        fields.push("user_password = ?");
        values.push(hashedPassword);
      }

      if (fields.length === 0) return res.status(400).json({ message: "No fields to update" });

      values.push(userId);

      db.query(
        `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE user_id = ?`,
        values,
        (err2) => {
          if (err2) return res.status(500).json({ message: "Database error" });
          res.json({ message: "User updated successfully" });
        }
      );
    };

    if (password) {
      const hashedPassword = await hashPassword(password);
      doUpdate(hashedPassword);
    } else {
      doUpdate();
    }
  });
};


// Delete user (Admin only)
exports.deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE user_id = ?", [req.params.userId], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "User deleted successfully" });
  });
};