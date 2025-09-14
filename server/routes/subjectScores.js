const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all scores (optionally filter by mode & university)
router.get("/", (req, res) => {
  const { mode, university_id } = req.query;

  let query = `
    SELECT 
      ss.score_id,
      ss.subject_id,
      ss.university_id,
      ss.mode,
      sub.subject_name,
      sub.subject_code,
      ss.items,
      ss.exam_type,
      ss.exam_date
    FROM subject_scores ss
    LEFT JOIN subjects sub ON ss.subject_id = sub.subject_id
  `;

  const conditions = [];
  const values = [];

  if (mode) {
    conditions.push("ss.mode = ?");
    values.push(mode);
  }
  if (university_id) {
    conditions.push("ss.university_id = ?");
    values.push(university_id);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY ss.exam_date DESC";

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET by examType (optionally filter by mode & university)
router.get("/:examType", (req, res) => {
  const { mode, university_id } = req.query;
  const examType = req.params.examType;

  let query = `
    SELECT 
      ss.score_id, 
      ss.exam_type, 
      ss.subject_id,
      ss.university_id,
      ss.mode,
      sub.subject_name,
      sub.subject_code,
      ss.items,
      ss.exam_date
    FROM subject_scores ss
    JOIN subjects sub ON ss.subject_id = sub.subject_id
    WHERE ss.exam_type = ?
  `;

  const values = [examType];

  if (mode) {
    query += " AND ss.mode = ?";
    values.push(mode);
  }
  if (university_id) {
    query += " AND ss.university_id = ?";
    values.push(university_id);
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error fetching subject scores:", err);
      return res.status(500).json({ error: "Failed to fetch subject scores" });
    }
    res.json(results);
  });
});

// POST new subject score
router.post("/", (req, res) => {
  console.log("Incoming body:", req.body);

  const { subject_id, university_id, mode, items, exam_date, exam_type } = req.body;

  if (!subject_id || !university_id || !mode || !items || !exam_date || !exam_type) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    INSERT INTO subject_scores (subject_id, university_id, mode, items, exam_date, exam_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [subject_id, university_id, mode, items, exam_date, exam_type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const newId = result.insertId;

    const fetchQuery = `
      SELECT ss.score_id, ss.subject_id, ss.university_id, ss.mode, 
             ss.items, ss.exam_date, ss.exam_type, sub.subject_name
      FROM subject_scores ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE ss.score_id = ?
    `;

    db.query(fetchQuery, [newId], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(results[0]);
    });
  });
});

// PUT update
router.put("/:id", (req, res) => {
  const score_id = req.params.id;
  const { subject_id, university_id, mode, items, exam_date, exam_type } = req.body;

  if (!subject_id || !university_id || !mode || !items || !exam_date || !exam_type) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    UPDATE subject_scores
    SET subject_id = ?, university_id = ?, mode = ?, items = ?, exam_date = ?, exam_type = ?
    WHERE score_id = ?
  `;
console.log("Incoming body:", req.body);

  db.query(query, [subject_id, university_id, mode, items, exam_date, exam_type, score_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const fetchQuery = `
      SELECT 
        ss.score_id,
        ss.subject_id,
        ss.university_id,
        ss.mode,
        sub.subject_name,
        sub.subject_code,
        ss.items,
        ss.exam_date,
        ss.exam_type
      FROM subject_scores ss
      LEFT JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE ss.score_id = ?
    `;

    db.query(fetchQuery, [score_id], (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(results[0]);
    });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const score_id = req.params.id;
  const query = "DELETE FROM subject_scores WHERE score_id = ?";
  db.query(query, [score_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Subject score deleted successfully" });
  });
});

module.exports = router;
