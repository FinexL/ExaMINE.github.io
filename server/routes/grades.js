const express = require("express");
const router = express.Router();
const db = require("../db"); // your database connection

// GET /api/grades?exam_type=Prelim
router.get("/", (req, res) => {
  const examType = req.query.exam_type || "Prelim";

  const query = `
    SELECT 
      CONCAT(s.first_name, ' ', s.last_name) AS student_name,
      sub.subject_name,
      ss.exam_type,
      sg.score
    FROM student_grades sg
    JOIN students s ON sg.student_id = s.student_id
    JOIN subject_scores ss ON sg.score_id = ss.score_id
    JOIN subjects sub ON ss.subject_id = sub.subject_id
    WHERE ss.exam_type = ?
    ORDER BY s.last_name, sub.subject_name
  `;

  db.query(query, [examType], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch grade table data", detail: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
