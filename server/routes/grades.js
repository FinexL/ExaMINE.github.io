const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.name AS student_name,
        u.university_name,
        ss.mode,
        ss.exam_type,
        sg.score,
        sg.grade_status
      FROM student_grades sg
      JOIN students s ON sg.student_id = s.student_id
      JOIN subject_scores ss ON sg.score_id = ss.score_id
      JOIN universities u ON ss.university_id = u.university_id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching grades:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
