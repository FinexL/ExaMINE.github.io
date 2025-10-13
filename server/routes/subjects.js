const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL subjects
router.get("/", (req, res) => {
  const query = `
    SELECT 
      sub.subject_id,
      sub.subject_name
    FROM subjects sub
    WHERE sub.is_archived = 0
    ORDER BY sub.subject_name
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// CREATE subject with restore check
router.post("/", (req, res) => {
  const { subject_name } = req.body;

  if (!subject_name || !subject_name.trim()) {
    return res.status(400).json({ error: "Subject Name is required." });
  }

  // 1. Check if the subject already exists (archived or active)
  const checkQuery = `SELECT * FROM subjects WHERE subject_name = ?`;
  db.query(checkQuery, [subject_name.trim()], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const subject = results[0];
      if (subject.is_archived === 1) {
        // Subject exists but archived → suggest restore
        return res.status(409).json({
          error: "ARCHIVED_EXISTS",
          message: `${subject_name} exists in archive. Do you want to restore it?`,
          subject_id: subject.subject_id,
        });
      } else {
        // Active duplicate
        return res.status(400).json({
          error: "DUPLICATE",
          message: "Subject name already exists.",
        });
      }
    }

    // 2. Subject doesn't exist → insert new
    const insertQuery = `INSERT INTO subjects (subject_name) VALUES (?)`;
    db.query(insertQuery, [subject_name.trim()], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const fetchInserted = `SELECT subject_id, subject_name FROM subjects WHERE subject_id = ?`;
      db.query(fetchInserted, [result.insertId], (err3, results2) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.status(201).json(results2[0]);
      });
    });
  });
});

// RESTORE archived subject
router.patch("/:id/restore", (req, res) => {
  const subject_id = req.params.id;
  const query = `UPDATE subjects SET is_archived = 0 WHERE subject_id = ?`;
  db.query(query, [subject_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "Subject restored" });
  });
});


// UPDATE subject
router.put("/:id", (req, res) => {
  const subject_id = req.params.id;
  const { subject_name } = req.body;

  if (!subject_name || !subject_name.trim()) {
    return res.status(400).json({ error: "Subject Name is required." });
  }

  const query = `
    UPDATE subjects 
    SET subject_name = ?
    WHERE subject_id = ?
  `;

  db.query(query, [subject_name, subject_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const fetchUpdated = `
      SELECT 
        sub.subject_id,
        sub.subject_name
        
      FROM subjects sub
      WHERE sub.subject_id = ?
    `;

    db.query(fetchUpdated, [subject_id], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(results[0]);
    });
  });
});

// DELETE subject
router.delete("/:id", (req, res) => {
  const subject_id = req.params.id;

  const query = "DELETE FROM subjects WHERE subject_id = ?";
  db.query(query, [subject_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Subject deleted" });
  });
});

module.exports = router;
