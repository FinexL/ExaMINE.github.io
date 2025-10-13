const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all students (non-archived by default)
router.get("/", (req, res) => {
  const { mode, archived } = req.query;

  let query = `
    SELECT s.student_id, s.first_name, s.middle_name, s.last_name, s.suffix,
           s.university_id, s.season_id, s.modes,
           u.university_name
    FROM students s
    LEFT JOIN universities u ON s.university_id = u.university_id
  `;

  const params = [];

  // Filter by mode
  const filters = [];
  if (mode) filters.push("s.modes = ?");
  if (archived === "1") filters.push("s.is_archived = 1");
  else filters.push("s.is_archived = 0"); // default: non-archived

  if (filters.length) query += " WHERE " + filters.join(" AND ");
  query += " ORDER BY s.first_name ASC";

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST add new student
router.post("/", (req, res) => {
  const { first_name, middle_name, last_name, suffix, university_id, modes } =
    req.body;

  if (!first_name?.trim() || !last_name?.trim()) {
    return res
      .status(400)
      .json({ error: "First name and last name are required." });
  }

  // Get current season_id
  const seasonQuery = `SELECT season_id FROM seasons WHERE CURDATE() BETWEEN start_date AND end_date LIMIT 1`;

  db.query(seasonQuery, (err, seasonResult) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!seasonResult.length)
      return res.status(400).json({ error: "No active season found." });

    const season_id = seasonResult[0].season_id;

    // Fetch university mode
    db.query(
      "SELECT modes FROM universities WHERE university_id = ?",
      [university_id],
      (err2, uniResult) => {
        if (err2) return res.status(500).json({ error: err2.message });
        if (!uniResult.length)
          return res.status(400).json({ error: "University not found." });

        const uniMode = uniResult[0].modes;
        const allowedModes = uniMode.split("&").map((m) => m.trim());

        if (!allowedModes.includes(modes)) {
          return res
            .status(400)
            .json({
              error: `Invalid mode for this university. Allowed: ${allowedModes.join(
                ", "
              )}`,
            });
        }

        // Insert student with is_archived = 0
        const insertQuery = `
        INSERT INTO students 
        (first_name, middle_name, last_name, suffix, university_id, season_id, modes, is_archived) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `;
        db.query(
          insertQuery,
          [
            first_name,
            middle_name || null,
            last_name,
            suffix || null,
            university_id,
            season_id,
            modes,
          ],
          (err3, result) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res
              .status(201)
              .json({ message: "Student added", student_id: result.insertId });
          }
        );
      }
    );
  });
});

// PUT update student
router.put("/:id", (req, res) => {
  const student_id = req.params.id;
  const { first_name, middle_name, last_name, suffix, university_id, modes } =
    req.body;

  if (!first_name?.trim() || !last_name?.trim()) {
    return res
      .status(400)
      .json({ error: "First name and last name are required." });
  }

  db.query(
    "SELECT modes FROM universities WHERE university_id = ?",
    [university_id],
    (err, uniResult) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!uniResult.length)
        return res.status(400).json({ error: "University not found." });

      const uniMode = uniResult[0].modes;
      const allowedModes = uniMode.split("&").map((m) => m.trim());

      if (!allowedModes.includes(modes)) {
        return res
          .status(400)
          .json({
            error: `Invalid mode for this university. Allowed: ${allowedModes.join(
              ", "
            )}`,
          });
      }

      const query = `
      UPDATE students SET
        first_name = ?, 
        middle_name = ?, 
        last_name = ?, 
        suffix = ?, 
        university_id = ?,
        modes = ?
      WHERE student_id = ?
    `;
      db.query(
        query,
        [
          first_name,
          middle_name || null,
          last_name,
          suffix || null,
          university_id,
          modes,
          student_id,
        ],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          const fetchUpdated = `
          SELECT s.*, u.university_name 
          FROM students s 
          LEFT JOIN universities u ON s.university_id = u.university_id
          WHERE s.student_id = ?
        `;
          db.query(fetchUpdated, [student_id], (err3, results) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res.json(results[0]);
          });
        }
      );
    }
  );
});

// DELETE -> soft delete (archive)
router.delete("/:id", (req, res) => {
  const student_id = req.params.id;
  db.query(
    "UPDATE students SET is_archived = 1 WHERE student_id = ?",
    [student_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Student archived" });
    }
  );
});

module.exports = router;
