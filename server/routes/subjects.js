const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL subjects
router.get("/", (req, res) => {
  const query = `
    SELECT 
      sub.subject_id,
      sub.subject_name,
      sub.subject_code
    FROM subjects sub
    ORDER BY sub.subject_name
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// CREATE subject
router.post("/", (req, res) => {
  const { subject_name, subject_code } = req.body;

  if (!subject_name || !subject_name.trim()) {
    return res.status(400).json({ error: "Subject Name is required." });
  }

  const query = `
    INSERT INTO subjects (subject_name, subject_code) 
    VALUES (?, ?)
  `;

  db.query(query, [subject_name, subject_code || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const newSubjectId = result.insertId;

    const fetchInserted = `
      SELECT 
        sub.subject_id,
        sub.subject_name,
        sub.subject_code
      FROM subjects sub
      WHERE sub.subject_id = ?
    `;

    db.query(fetchInserted, [newSubjectId], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(results[0]);
    });
  });
});

// UPDATE subject
router.put("/:id", (req, res) => {
  const subject_id = req.params.id;
  const { subject_name, subject_code } = req.body;

  if (!subject_name || !subject_name.trim()) {
    return res.status(400).json({ error: "Subject Name is required." });
  }

  const query = `
    UPDATE subjects 
    SET subject_name = ?, subject_code = ?
    WHERE subject_id = ?
  `;

  db.query(query, [subject_name, subject_code || null, subject_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const fetchUpdated = `
      SELECT 
        sub.subject_id,
        sub.subject_name,
        sub.subject_code
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
