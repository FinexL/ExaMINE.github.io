const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all universities with student count
router.get("/", (req, res) => {
  const query = `
    SELECT 
      u.university_id,
      u.university_name,
      COUNT(s.student_id) AS number_of_students,
      u.dean_name,
      u.dean_email
    FROM universities u
    LEFT JOIN students s ON u.university_id = s.university_id
    GROUP BY u.university_id, u.university_name, u.dean_name, u.dean_email
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new university
router.post("/", (req, res) => {
  const { university_name, dean_name, dean_email } = req.body;

  if (!university_name) {
    return res.status(400).json({ error: "University Name is required." });
  }

  const query = `
    INSERT INTO universities (university_name, dean_name, dean_email)
    VALUES (?, ?, ?)
  `;

  db.query(
    query,
    [university_name , dean_name, dean_email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "University added", university_id: result.insertId });
    }
  );
});

// PUT update university
router.put("/:id", (req, res) => {
  const university_id = req.params.id;
  const { university_name, dean_name, dean_email } = req.body;

  if (!university_name ) {
    return res.status(400).json({ error: "Name is required." });
  }

  const query = `
  UPDATE universities SET
    university_name = ?,
    dean_name = ?,
    dean_email = ?
  WHERE university_id = ?
`;

db.query(
  query,
  [university_name, dean_name, dean_email, university_id],
  (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "University updated" });
  }
);
});

// DELETE university
router.delete("/:id", (req, res) => {
  const university_id = req.params.id;

  const query = "DELETE FROM universities WHERE university_id = ?";
  db.query(query, [university_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "University deleted" });
  });
});

module.exports = router;
