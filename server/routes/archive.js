// routes/archive.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

// Allowed tables for archiving
const allowedTables = [
  "students",
  "subjects",
  "users",
  "universities",
  "subject_scores",
];
const primaryKeys = {
  students: "student_id",
  subjects: "subject_id",
  universities: "university_id",
  subject_scores: "score_id",
  users: "user_id",
};

const validateTable = (table) => allowedTables.includes(table);

router.get("/:table", (req, res) => {
  const { table } = req.params;
  if (!validateTable(table))
    return res.status(400).json({ error: "Invalid table" });

  let query;
  switch (table) {
    case "students":
      query = `
        SELECT s.*, u.university_name, usr.user_name AS archived_by_name
        FROM students s
        LEFT JOIN universities u ON s.university_id = u.university_id
        LEFT JOIN users usr ON s.archived_by = usr.user_id
        WHERE s.is_archived = 1
      `;
      break;

    case "subjects":
      query = `
        SELECT subj.*, usr.user_name AS archived_by_name
        FROM subjects subj
        LEFT JOIN users usr ON subj.archived_by = usr.user_id
        WHERE subj.is_archived = 1
      `;
      break;

    case "universities":
      query = `
        SELECT uni.*, usr.user_name AS archived_by_name
        FROM universities uni
        LEFT JOIN users usr ON uni.archived_by = usr.user_id
        WHERE uni.is_archived = 1
      `;
      break;

    case "subject_scores":
      query = `
        SELECT 
          ss.*,
          sub.subject_name,
          u.university_name,
          usr.user_name AS archived_by_name
        FROM subject_scores ss
        LEFT JOIN subjects sub ON ss.subject_id = sub.subject_id
        LEFT JOIN universities u ON ss.university_id = u.university_id
        LEFT JOIN users usr ON ss.archived_by = usr.user_id
        WHERE ss.is_archived = 1
      `;
      break;

    case "users":
      query = `
        SELECT u.user_id, u.user_name, u.user_email, u.user_role, u.user_status,
               usr.user_name AS archived_by_name
        FROM users u
        LEFT JOIN users usr ON u.archived_by = usr.user_id
        WHERE u.is_archived = 1
      `;
      break;

    default:
      query = `
        SELECT t.*, usr.user_name AS archived_by_name
        FROM ?? t
        LEFT JOIN users usr ON t.archived_by = usr.user_id
        WHERE t.is_archived = 1
      `;
      break;
  }

  db.query(query, query.includes("??") ? [table] : [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/:table/archive", authenticateToken, (req, res) => {
  console.log("Archive route hit!");

  const { table } = req.params;
  const { ids } = req.body;
  const userId = req.user.id;
  if (!validateTable(table))
    return res.status(400).json({ error: "Invalid table" });
  if (!Array.isArray(ids) || !ids.length)
    return res.status(400).json({ error: "No IDs provided" });

  const idColumn = primaryKeys[table];

  if (table === "universities") {
    const checkQuery = `
      SELECT university_id, COUNT(*) AS student_count
      FROM students
      WHERE university_id IN (?) AND is_archived = 0
      GROUP BY university_id
    `;

    db.query(checkQuery, [ids], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const blocked = results.filter((r) => r.student_count > 0);
      if (blocked.length) {
        const messages = blocked.map(
          (r) =>
            `University ${r.university_id} has ${r.student_count} active student(s)`
        );
        return res
          .status(400)
          .json({ error: `Cannot archive: ${messages.join(", ")}` });
      }

      db.query(
        `UPDATE universities SET is_archived = 1, archived_by = ?, archived_at = NOW() WHERE university_id IN (?)`,
        [userId, ids],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ success: true, count: result.affectedRows });
        }
      );
    });
  } else if (table === "subjects") {
    const checkQuery = `
      SELECT ss.subject_id, ss.score_id, u.university_name
      FROM subject_scores ss
      JOIN universities u ON ss.university_id = u.university_id
      WHERE ss.subject_id IN (?)
        AND ss.is_archived = 0
        AND u.is_archived = 0
    `;

    db.query(checkQuery, [ids], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length) {
        const messages = results.map(
          (r) =>
            `Subject ${r.subject_id} has active score ${r.score_id} at active university "${r.university_name}"`
        );
        return res
          .status(400)
          .json({ error: `Cannot archive: ${messages.join("; ")}` });
      }

      db.query(
        `UPDATE subjects SET is_archived = 1, archived_by = ?, archived_at = NOW() WHERE subject_id IN (?)`,
        [userId, ids],

        (err2, result) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ success: true, count: ids.length });
        }
      );
    });
  } else {
    // Generic archive
    db.query(
      `UPDATE ?? SET is_archived = 1, archived_by = ?, archived_at = NOW() WHERE ?? IN (?)`,
      [table, userId, idColumn, ids],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, count: ids.length });
      }
    );
  }
});

// =================== POST unarchive ===================
router.post("/:table/unarchive", authenticateToken, (req, res) => {
  const { table } = req.params;
  const { ids } = req.body;
  const userId = req.user.user_id;
  if (!validateTable(table))
    return res.status(400).json({ error: "Invalid table" });
  if (!Array.isArray(ids) || !ids.length)
    return res.status(400).json({ error: "No IDs provided" });

  const idColumn = primaryKeys[table];

  if (table === "subject_scores") {
    const checkQuery = `
      SELECT ss.score_id, subj.subject_name, u.university_name, subj.is_archived AS subj_archived, u.is_archived AS uni_archived
      FROM subject_scores ss
      JOIN subjects subj ON ss.subject_id = subj.subject_id
      JOIN universities u ON ss.university_id = u.university_id
      WHERE ss.score_id IN (?) AND (subj.is_archived = 1 OR u.is_archived = 1)
    `;

    db.query(checkQuery, [ids], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length) {
        const blocked = results.map((r) => {
          if (r.subj_archived) {
            return `Score ${r.score_id} cannot be unarchived because subject "${r.subject_name}" is archived`;
          }
          if (r.uni_archived) {
            return `Score ${r.score_id} cannot be unarchived because university "${r.university_name}" is archived`;
          }
        });
        return res.status(400).json({ error: blocked.join("; ") });
      }

      const unarchiveQuery = `
        UPDATE subject_scores
        SET is_archived = 0, archived_by = NULL, archived_at = NOW()
        WHERE score_id IN (?)
      `;
      db.query(unarchiveQuery, [ids], (err2, result) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ success: true, count: result.affectedRows });
      });
    });
  } else {
    // Generic unarchive
    const unarchiveQuery = `
      UPDATE ?? 
      SET is_archived = 0, archived_by = NULL, archived_at = NULL 
      WHERE ?? IN (?)
    `;
    db.query(unarchiveQuery, [table, idColumn, ids], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, count: result.affectedRows });
    });
  }
});

module.exports = router;
