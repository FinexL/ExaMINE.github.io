const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all universities with student count
router.get("/", (req, res) => {
  const query = `
    SELECT 
      u.university_id,
      u.university_name,
      u.modes,
      COUNT(s.student_id) AS number_of_students,
      u.dean_name,
      u.dean_email
    FROM universities u
    LEFT JOIN students s 
      ON u.university_id = s.university_id AND s.is_archived = 0
    WHERE u.is_archived = 0
    GROUP BY u.university_id, u.university_name, u.dean_name, u.dean_email
    ORDER BY u.university_name ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// POST new university
router.post("/", (req, res) => {
  const { university_name, modes, dean_name, dean_email } = req.body;

  if (!university_name) {
    return res.status(400).json({ error: "University Name is required." });
  }

  // 1. Check if already exists (archived or not)
  const checkQuery = "SELECT * FROM universities WHERE university_name = ?";
  db.query(checkQuery, [university_name], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const uni = results[0];

      if (uni.is_archived === 1) {
        // Case: found but archived
        return res.status(409).json({
          error: "ARCHIVED_EXISTS",
          message: `${university_name} already exists in archive. Do you want to restore it instead?`,
          university_id: uni.university_id,
        });
      } else {
        // Case: active duplicate
        return res.status(400).json({
          error: "DUPLICATE",
          message: "University name already exists.",
        });
      }
    }

    // 2. If not exists → insert new
    const insertQuery = `
      INSERT INTO universities (university_name, modes, dean_name, dean_email)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [university_name, modes, dean_name, dean_email],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res
          .status(201)
          .json({
            message: "University added",
            university_id: result.insertId,
          });
      }
    );
  });
});

// Restore archived university
router.post("/:id/restore", (req, res) => {
  const { id } = req.params;

  const query =
    "UPDATE universities SET is_archived = 0 WHERE university_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ success: true, message: "University restored" });
  });
});

// PUT update university
// PUT update university
router.put("/:id", (req, res) => {
  const university_id = req.params.id;
  const { university_name, modes, dean_name, dean_email } = req.body;

  if (!university_name) {
    return res.status(400).json({ error: "University name is required." });
  }

  const query = `
    UPDATE universities SET
      university_name = ?,
      modes = ?,
      dean_name = ?,
      dean_email = ?
    WHERE university_id = ?
  `;

  db.query(
    query,
    [university_name, modes, dean_name, dean_email, university_id],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ error: "University name already exists." });
        }
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "University not found" });
      }

      res.json({ message: "University updated successfully" });
    }
  );
});

// DELETE university
router.delete("/:id", (req, res) => {
  const university_id = req.params.id;
  //copy it later in the other table when I need to check if other data being use from other table
  //update also hooks and confirmdelete,cancel delete and handleDeleteClick...
  //also add dialog
  const checkQuery =
    "SELECT COUNT(*) AS count FROM students WHERE university_id = ?";
  db.query(checkQuery, [university_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results[0].count > 0) {
      return res.status(400).json({
        error: "University is linked to student records",
      });
    }

    const deleteQuery = "DELETE FROM universities WHERE university_id = ?";
    db.query(deleteQuery, [university_id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "University deleted" });
    });
  });
});

module.exports = router;
