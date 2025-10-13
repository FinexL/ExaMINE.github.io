// routes/student_grades.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// -------------------------
// GET all Onsite students (all universities)
// -------------------------
router.get("/students/onsite", async (req, res) => {
  try {
    const [students] = await db.promise().query(`
      SELECT DISTINCT 
        s.student_id,
        s.first_name,
        s.last_name,
        s.middle_name,
        s.suffix,
        s.university_id,
        u.university_name
      FROM students s
      JOIN universities u ON s.university_id = u.university_id
      JOIN student_grades g ON s.student_id = g.student_id
      JOIN subject_scores ss ON g.score_id = ss.score_id
      WHERE LOWER(ss.mode) = 'onsite'
        AND s.is_archived = 0
        AND u.is_archived = 0
        AND g.is_archived = 0
        AND ss.is_archived = 0
    `);

    const [subjects] = await db.promise().query(`
      SELECT ss.score_id, ss.subject_id, sub.subject_name,ss.exam_type,ss.items
      FROM subject_scores ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE LOWER(ss.mode) = 'onsite'
        AND ss.is_archived = 0
        AND sub.is_archived = 0
    `);

    const [grades] = await db.promise().query(`
      SELECT g.*,
        ss.exam_type,
    sub.subject_name
      FROM student_grades g
      JOIN subject_scores ss ON g.score_id = ss.score_id
      JOIN students s ON g.student_id = s.student_id
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      JOIN universities u ON s.university_id = u.university_id
      WHERE LOWER(ss.mode) = 'onsite'
        AND g.is_archived = 0
        AND ss.is_archived = 0
        AND s.is_archived = 0
        AND sub.is_archived = 0
        AND u.is_archived = 0
    `);

    res.json({ students, subjects, grades });
  } catch (err) {
    console.error("Error fetching Onsite students:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch Onsite students", detail: err.message });
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
      WHERE university_id = ?
        AND TRIM(LOWER(modes)) = 'inhouse'
        AND is_archived = 0
      ORDER BY last_name, first_name
    `;
    const [students] = await db.promise().query(query, [universityId]);
    res.json({ students });
  } catch (err) {
    console.error("Error fetching Inhouse students:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch Inhouse students", detail: err.message });
  }
});
// -------------------------
// GET Onsite students for a specific university
// -------------------------
router.get("/students/onsite/:universityId", async (req, res) => {
  const { universityId } = req.params;

  try {
    const query = `
      SELECT student_id, first_name, last_name, middle_name, suffix, modes, university_id
      FROM students
      WHERE university_id = ?
        AND TRIM(LOWER(modes)) = 'onsite'
        AND is_archived = 0
      ORDER BY last_name, first_name
    `;
    const [students] = await db.promise().query(query, [universityId]);

    // You can also fetch subjects and grades if needed
    // Example: fetching subject_scores for onsite + this university
    const [subjects] = await db.promise().query(
      `
      SELECT ss.score_id, ss.subject_id, ss.items, ss.exam_type, sub.subject_name
      FROM subject_scores ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE LOWER(ss.mode) = 'onsite'
        AND ss.university_id = ?
        AND ss.is_archived = 0
        AND sub.is_archived = 0
    `,
      [universityId]
    );

    const scoreIds = subjects.map((s) => s.score_id);
    let grades = [];
    if (scoreIds.length) {
      const placeholders = scoreIds.map(() => "?").join(",");
      const [rawGrades] = await db.promise().query(
        `
        SELECT g.student_grade_id, g.student_id, g.score_id, g.score, g.grade_status, ss.exam_type 
        FROM student_grades g
        WHERE g.score_id IN (${placeholders})
          AND g.is_archived = 0
      `,
        scoreIds
      );
      grades = rawGrades;
    }

    res.json({ students, subjects, grades });
  } catch (err) {
    console.error("Error fetching Onsite students for university:", err);
    res.status(500).json({
      error: "Failed to fetch Onsite students for this university",
      detail: err.message,
    });
  }
});

// -------------------------
// GET students and their grades by mode
// -------------------------
router.get("/table_by_mode/:mode", async (req, res) => {
  const mode = req.params.mode.toLowerCase();
  const { universityId } = req.query;

  try {
    let studentsQuery = `
      SELECT 
        s.student_id, 
        s.first_name, 
        s.last_name, 
        s.middle_name, 
        s.suffix, 
        s.modes,
        s.university_id,
        u.university_name
      FROM students s
      JOIN universities u ON s.university_id = u.university_id
      WHERE TRIM(LOWER(s.modes)) = ?
        AND s.is_archived = 0
        AND u.is_archived = 0
    `;
    const queryParams = [mode];

    if (mode === "inhouse") {
      if (!universityId) {
        return res
          .status(400)
          .json({ error: "universityId is required for inhouse mode" });
      }
      studentsQuery += ` AND s.university_id = ?`;
      queryParams.push(universityId);
    }

    studentsQuery += ` ORDER BY s.last_name, s.first_name`;
    const [students] = await db.promise().query(studentsQuery, queryParams);

    // exam types by mode
    const examTypes =
      mode === "onsite"
        ? ["Post Test", "Preboard 1", "Final Preboard"]
        : ["Prelim", "Midterm", "Finals"];

    const placeholders = examTypes.map(() => "?").join(",");
    let subjectsQuery = `
      SELECT ss.score_id, ss.subject_id, ss.items, ss.exam_date, ss.exam_type, sub.subject_name
      FROM subject_scores ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      WHERE ss.exam_type IN (${placeholders})
        AND ss.is_archived = 0
        AND sub.is_archived = 0
    `;
    const subjectParams = [...examTypes];

    if (mode === "inhouse") {
      subjectsQuery += ` AND ss.university_id = ?`;
      subjectParams.push(universityId);
    }

    subjectsQuery += ` ORDER BY ss.exam_date`;
    const [subjects] = await db.promise().query(subjectsQuery, subjectParams);

    // grades
    const scoreIds = subjects.map((s) => s.score_id);
    let grades = [];
    if (scoreIds.length) {
      const scorePlaceholders = scoreIds.map(() => "?").join(",");
      const gradesQuery = `
        SELECT g.student_grade_id, g.student_id, g.score_id, g.score, g.grade_status, ss.exam_type, sub.subject_name 
        FROM student_grades g
        JOIN students s ON g.student_id = s.student_id
        JOIN subject_scores ss ON g.score_id = ss.score_id
        JOIN subjects sub ON ss.subject_id = sub.subject_id
        JOIN universities u ON s.university_id = u.university_id
        WHERE g.score_id IN (${scorePlaceholders})
          AND g.is_archived = 0
          AND s.is_archived = 0
          AND ss.is_archived = 0
          AND sub.is_archived = 0
          AND u.is_archived = 0
      `;
      const [rawGrades] = await db.promise().query(gradesQuery, scoreIds);
      grades = rawGrades;
    }

    res.json({ students, subjects, grades });
  } catch (err) {
    console.error("Error in /table_by_mode/:mode", err);
    res
      .status(500)
      .json({ error: "Failed to fetch grades by mode", detail: err.message });
  }
});

// -------------------------
// GET structured export data by mode (for Excel export) with optional filters
// -------------------------
router.get("/export/:mode", async (req, res) => {
  const mode = req.params.mode.toLowerCase();
  const { universityId, Examtype, subject } = req.query;

  try {
    // Parse optional filters
    const selectedExamTypes = Examtype
      ? Examtype.split(",").map((t) => t.trim())
      : [];

    const selectedSubject = subject ? subject.trim() : null;

    // Fetch students
    const [students] = await db.promise().query(
      `
      SELECT 
        s.student_id,
        CONCAT(
          s.last_name, ', ', s.first_name,
          IF(s.middle_name IS NOT NULL AND s.middle_name != '', CONCAT(' ', s.middle_name), ''),
          IF(s.suffix IS NOT NULL AND s.suffix != '', CONCAT(' ', s.suffix), '')
        ) AS student_name,
        u.university_name,
        s.university_id
      FROM students s
      JOIN universities u ON s.university_id = u.university_id
      WHERE LOWER(s.modes) = ?
        AND s.is_archived = 0
        AND u.is_archived = 0
        ${mode === "inhouse" && universityId ? "AND s.university_id = ?" : ""}
      ORDER BY s.last_name, s.first_name
    `,
      mode === "inhouse" && universityId ? [mode, universityId] : [mode]
    );

    // Determine exam types (filtered if provided)
    const defaultExamTypes =
      mode === "onsite"
        ? ["Post Test", "Preboard 1", "Final Preboard"]
        : ["Prelim", "Midterm", "Finals"];

    const examTypes = selectedExamTypes.length
      ? selectedExamTypes
      : defaultExamTypes;

    // Fetch subjects
    const placeholders = examTypes.map(() => "?").join(",");
    let subjectParams = [...examTypes];
    let subjectsQuery = `
      SELECT 
        ss.score_id,
        ss.subject_id,
        ss.exam_type,
        ss.items,
        ss.exam_date,
        ss.university_id,
        sub.subject_name,
        u.university_name
      FROM subject_scores ss
      JOIN subjects sub ON ss.subject_id = sub.subject_id
      JOIN universities u ON ss.university_id = u.university_id
      WHERE LOWER(ss.mode) = ?
        AND ss.exam_type IN (${placeholders})
        AND ss.is_archived = 0
        AND sub.is_archived = 0
        AND u.is_archived = 0
    `;

    subjectParams.unshift(mode); // add mode before exam types

    if (mode === "inhouse" && universityId) {
      subjectsQuery += ` AND ss.university_id = ?`;
      subjectParams.push(universityId);
    }

    if (selectedSubject) {
      subjectsQuery += ` AND sub.subject_name LIKE ?`;
      subjectParams.push(`%${selectedSubject}%`);
    }

    subjectsQuery += ` ORDER BY ss.exam_date`;

    const [subjects] = await db.promise().query(subjectsQuery, subjectParams);

    // Fetch grades
    const scoreIds = subjects.map((s) => s.score_id);
    let grades = [];
    if (scoreIds.length) {
      const placeholders = scoreIds.map(() => "?").join(",");
      const [rawGrades] = await db.promise().query(
        `
        SELECT 
          g.student_grade_id,
          g.student_id,
          g.score_id,
          g.score,
          g.grade_status,
          ss.exam_type,
          sub.subject_name 
        FROM student_grades g
        JOIN students s ON g.student_id = s.student_id
        JOIN subject_scores ss ON g.score_id = ss.score_id
        WHERE g.score_id IN (${placeholders})
          AND g.is_archived = 0
          AND s.is_archived = 0
          AND ss.is_archived = 0
      `,
        scoreIds
      );
      grades = rawGrades;
    }

    // Build structured export data
    const structuredData = students.map((student) => {
      const studentGrades = grades.filter(
        (g) => g.student_id === student.student_id
      );
      const scores = {};

      subjects.forEach((subj) => {
        const grade = studentGrades.find((g) => g.score_id === subj.score_id);
        scores[`${subj.subject_name} (${subj.exam_type})`] = {
          score: grade ? grade.score : null,
          total: subj.items,
        };
      });

      return {
        student: student.student_name,
        school: student.university_name,
        scores,
      };
    });

    res.json({
      mode,
      filters: { universityId, examTypes, selectedSubject },
      students,
      subjects,
      grades,
      structuredData,
    });
  } catch (err) {
    console.error("Error in /export/:mode:", err);
    res.status(500).json({
      error: "Failed to fetch export data",
      detail: err.message,
    });
  }
});

// -------------------------
// GET grades by student ID
// -------------------------
router.get("/:id/grades", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        ss.exam_type,
        sg.score,
        ss.items,
        subj.subject_id,
        subj.subject_name,
        CONCAT(s.last_name, ', ', s.first_name, ' ', IFNULL(s.middle_name, ''), ' ', IFNULL(s.suffix, '')) AS studentName,
        u.university_name
      FROM student_grades sg
      JOIN subject_scores ss ON sg.score_id = ss.score_id
      JOIN subjects subj ON ss.subject_id = subj.subject_id
      JOIN students s ON sg.student_id = s.student_id
      JOIN universities u ON s.university_id = u.university_id
      WHERE sg.student_id = ?
        AND sg.is_archived = 0
        AND s.is_archived = 0
        AND ss.is_archived = 0
        AND subj.is_archived = 0
        AND u.is_archived = 0
      ORDER BY ss.exam_type, subj.subject_name
    `;
    const [results] = await db.promise().query(query, [id]);

    if (!results.length) {
      return res
        .status(404)
        .json({ error: "No grades found for this student." });
    }

    const grouped = results.reduce((acc, row) => {
      if (!acc[row.exam_type]) acc[row.exam_type] = [];
      acc[row.exam_type].push({
        subject_id: row.subject_id,
        subject_name: row.subject_name,
        score: row.score,
        items: row.items,
      });
      return acc;
    }, {});

    res.json({
      studentName: results[0].studentName,
      university_name: results[0].university_name,
      examTypes: grouped,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

  const invalid = grades.find(
    (g) =>
      !g.student_id ||
      !g.score_id ||
      (g.score !== null && typeof g.score !== "number")
  );
  if (invalid) {
    return res.status(400).json({
      error:
        "Invalid grade object. Each must have student_id, score_id, and numeric score or null.",
    });
  }

  const values = grades.map((g) => [
    g.student_id,
    g.score_id,
    g.score,
    g.grade_status || null,
  ]);

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
    res
      .status(500)
      .json({
        error: "Failed to save grades",
        detail: err.sqlMessage || err.message,
      });
  }
});

module.exports = router;
