const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all students
router.get("/", (req, res) => {
  const query = `
    SELECT 
      s.student_id,
      s.first_name,
      s.middle_name,
      s.last_name,
      s.suffix,
      s.university_id,
      u.university_name,
      DATE_FORMAT(s.add_date, '%Y-%m-%d') AS add_date
    FROM students s
    LEFT JOIN universities u ON s.university_id = u.university_id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.post("/", (req, res) => {
  const { first_name, middle_name, last_name, suffix, university_id, add_date } = req.body;

  if (!first_name || !first_name.trim() || !last_name || !last_name.trim()) {
    return res.status(400).json({ error: "First name and last name are required." });
  }

  const query = `
    INSERT INTO students 
    (first_name, middle_name, last_name, suffix, university_id, add_date) 
    VALUES (?, ?, ?, ?, ?, ?) 
  `;
  db.query(
    query,
    [first_name, middle_name, last_name, suffix || null, university_id, add_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Student added", student_id: result.insertId });
    }
  );
});

// PUT update student
router.put("/:id", (req, res) => {
  const student_id = req.params.id;
  const {
    first_name,
    middle_name,
    last_name,
    suffix,
    university_id,
    add_date,
  } = req.body;

  if (!first_name || !first_name.trim() || !last_name || !last_name.trim()) {
    return res
      .status(400)
      .json({ error: "First name and last name are required." });
  }

  const query = `
    UPDATE students SET
      first_name = ?, 
      middle_name = ?, 
      last_name = ?, 
      suffix = ?, 
      university_id = ?, 
      add_date = ?
    WHERE student_id = ?
  `;

  db.query(
    query,
    [first_name, middle_name, last_name, suffix || null, university_id, add_date, student_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const fetchUpdated = `
        SELECT 
          s.student_id,
          s.first_name,
          s.middle_name,
          s.last_name,
          s.suffix,
          s.university_id,
          u.university_name,
          DATE_FORMAT(s.add_date, '%Y-%m-%d') AS add_date
        FROM students s
        LEFT JOIN universities u ON s.university_id = u.university_id
        WHERE s.student_id = ?
      `;

      db.query(fetchUpdated, [student_id], (err2, results) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(results[0]); 
      });
    }
  );
});


// DELETE student
router.delete("/:id", (req, res) => {
  const student_id = req.params.id;

  const query = "DELETE FROM students WHERE student_id = ?";
  db.query(query, [student_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Student deleted" });
  });
});

module.exports = router;
