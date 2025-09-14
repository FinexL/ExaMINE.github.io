// routes/student_grades.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// -------------------------
// GET all Onsite students (all universities)
// -------------------------
router.get("/students/onsite", async (req, res) => {
  try {
    const query = `
      SELECT student_id, first_name, last_name, middle_name, suffix, modes, university_id
      FROM students
      WHERE TRIM(LOWER(modes)) = 'onsite'
      ORDER BY last_name, first_name
    `;
    const [students] = await db.promise().query(query);
    res.json({ students });
  } catch (err) {
    console.error("Error fetching Onsite students:", err);
    res.status(500).json({ error: "Failed to fetch Onsite students", detail: err.message });
  }
});

// -------------------------
// GET Inhouse students for a specific university
// -------------------------
router.get("/students/inhouse/:universityId", async (req, res) => {
  const { universityId } = req.params;

  try {
    const query = `
      SELECT student_id, first_name, last_name, middle_name, suffix, modes, university_id
      FROM students
      WHERE university_id = ? AND TRIM(LOWER(modes)) = 'inhouse'
      ORDER BY last_name, first_name
    `;
    const [students] = await db.promise().query(query, [universityId]);
    res.json({ students });
  } catch (err) {
    console.error("Error fetching Inhouse students:", err);
    res.status(500).json({ error: "Failed to fetch Inhouse students", detail: err.message });
  }
});

// -------------------------
// GET students and their grades by mode
// mode = 'Onsite' or 'Inhouse'
// -------------------------
router.get("/table_by_mode/:mode", async (req, res) => {
  const mode = req.params.mode.toLowerCase();

  try {
    // 1) Fetch students by mode
    const studentsQuery = `
      SELECT student_id, first_name, last_name, middle_name, suffix, modes
      FROM students
      WHERE TRIM(LOWER(modes)) = ?
      ORDER BY last_name, first_name
    `;
    const [students] = await db.promise().query(studentsQuery, [mode]);

    // 2) Determine exam types based on mode
    const examTypes =
      mode === "onsite"
        ? ["Post Test", "Preboard 1", "Final Preboard"]
        : ["Prelim", "Midterm", "Finals"];

    // 3) Fetch subjects for these exam types safely using placeholders
    const placeholders = examTypes.map(() => "?").join(",");
    const subjectsQuery = `
      SELECT ss.score_id, ss.subject_id, ss.items, ss.exam_date, ss.exam_type, sub.subject_name
      FROM subject_scores ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE ss.exam_type IN (${placeholders})
      ORDER BY ss.exam_date
    `;
    const [subjects] = await db.promise().query(subjectsQuery, examTypes);

    // 4) Fetch existing grades for these score_ids
    const scoreIds = subjects.map((s) => s.score_id);
    let grades = [];
    if (scoreIds.length) {
      const scorePlaceholders = scoreIds.map(() => "?").join(",");
      const gradesQuery = `
        SELECT student_grade_id, student_id, score_id, score, grade_status
        FROM student_grades
        WHERE score_id IN (${scorePlaceholders})
      `;
      const [rawGrades] = await db.promise().query(gradesQuery, scoreIds);
      grades = rawGrades;
    }

    res.json({ students, subjects, grades });
  } catch (err) {
    console.error("Error in /table_by_mode/:mode", err);
    res.status(500).json({ error: "Failed to fetch grades by mode", detail: err.message });
  }
});

// -------------------------
// POST bulk insert/update grades
// -------------------------
router.post("/bulk", async (req, res) => {
  const grades = req.body;

  if (!Array.isArray(grades) || grades.length === 0) {
    return res.status(400).json({ error: "No grades provided" });
  }

  // Validate shape quickly
  const invalid = grades.find(
    (g) => !g.student_id || !g.score_id || (g.score !== null && typeof g.score !== "number")
  );
  if (invalid) {
    return res.status(400).json({
      error: "Invalid grade object. Each must have student_id, score_id, and numeric score or null.",
    });
  }

  const values = grades.map((g) => [g.student_id, g.score_id, g.score, g.grade_status || null]);

  const query = `
    INSERT INTO student_grades (student_id, score_id, score, grade_status)
    VALUES ?
    ON DUPLICATE KEY UPDATE score = VALUES(score), grade_status = VALUES(grade_status)
  `;

  try {
    const [result] = await db.promise().query(query, [values]);
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    console.error("Failed to save grades:", err);
    res.status(500).json({ error: "Failed to save grades", detail: err.sqlMessage || err.message });
  }
});

module.exports = router;
