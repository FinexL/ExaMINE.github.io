const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
  const { topic_id, max_score, exam_type } = req.body;

  if (!topic_id || !max_score || !exam_type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

    const [scoreResult] = await db.query(
      "INSERT INTO topic_scores (topic_id, max_score, exam_date) VALUES (?, ?, NOW())",
      [topic_id, max_score]
    );

    const score_id = scoreResult.insertId;

    const [gradingResult] = await db.query(
      "INSERT INTO grading (score_id, exam_type) VALUES (?, ?)",
      [score_id, exam_type]
    );

    res.status(201).json({
      message: "Exam created successfully",
      grading_id: gradingResult.insertId,
    });
  } catch (err) {
    console.error("Error creating exam:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all exams with topics
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT g.grading_id, g.exam_type, ts.score_id, ts.max_score, ts.exam_date, t.topic_name
      FROM grading g
      JOIN topic_scores ts ON g.score_id = ts.score_id
      JOIN topics t ON ts.topic_id = t.topic_id
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
