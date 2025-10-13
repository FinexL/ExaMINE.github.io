const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET top students for a university
// Optional query param: limit
router.get("/:universityId", async (req, res) => {
  const { universityId } = req.params;
  const { limit = 10 } = req.query;

  try {
    const query = `
      SELECT  
        s.student_id,
        CONCAT(
          s.last_name, ', ', s.first_name,
          IF(s.middle_name IS NOT NULL AND s.middle_name != '', CONCAT(' ', s.middle_name), ''),
          IF(s.suffix IS NOT NULL AND s.suffix != '', CONCAT(' ', s.suffix), '')
        ) AS studentName,
        s.university_id,
        u.university_name,
        SUM(g.score) AS totalScore,
        SUM(ss.items) AS totalItems,
        ROUND(SUM(g.score)/SUM(ss.items)*100, 2) AS percent
      FROM student_grades g
      JOIN students s ON g.student_id = s.student_id
      JOIN subject_scores ss ON g.score_id = ss.score_id
      JOIN universities u ON s.university_id = u.university_id
      WHERE s.university_id = ?
        AND g.is_archived = 0
        AND s.is_archived = 0
        AND ss.is_archived = 0
        AND u.is_archived = 0
      GROUP BY 
        s.student_id, s.last_name, s.first_name, s.middle_name, s.suffix, s.university_id, u.university_name
      ORDER BY percent DESC
      LIMIT ?
    `;

    const [topStudents] = await db
      .promise()
      .query(query, [universityId, parseInt(limit)]);
    res.json({ topStudents });
  } catch (err) {
    console.error("Error fetching top students:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch top students", detail: err.message });
  }
});

module.exports = router;
