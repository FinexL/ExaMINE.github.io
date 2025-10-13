const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  const { mode, university_id } = req.query;

  let query = `
    SELECT 
      ss.score_id,
      ss.subject_id,
      ss.university_id,
      ss.mode,
      sub.subject_name,
      ss.items,
      ss.exam_type,
      ss.exam_date
    FROM subject_scores ss
    LEFT JOIN subjects sub ON ss.subject_id = sub.subject_id
    WHERE ss.is_archived = 0
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

  // ✅ fix: append with AND instead of another WHERE
  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  query += " ORDER BY ss.exam_date DESC";

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ GET scores by mode & exam_type
router.get("/by-mode-exam", (req, res) => {
  const { mode, exam_type } = req.query;

  if (!mode || !exam_type) {
    return res.status(400).json({ error: "mode and exam_type are required" });
  }

  const query = `
    SELECT 
      ss.subject_id,
      sub.subject_name,
      ss.items
    FROM subject_scores ss
    JOIN subjects sub ON ss.subject_id = sub.subject_id
    WHERE LOWER(ss.mode) = ? AND ss.exam_type = ?
    ORDER BY sub.subject_name
  `;

  db.query(query, [mode.toLowerCase(), exam_type], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ GET scores by examType
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

// ✅ POST new subject score (with restore if archived)
router.post("/", (req, res) => {
  const { subject_id, university_id, exam_type, mode, items, exam_date } =
    req.body;

  const checkQuery = `
    SELECT score_id, is_archived 
    FROM subject_scores
    WHERE subject_id = ? 
      AND university_id <=> ? 
      AND exam_type = ? 
      AND mode = ?
  `;

  db.query(
    checkQuery,
    [subject_id, university_id, exam_type, mode],
    (err, existing) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Server error", error: err.message });

      if (existing.length) {
        const score = existing[0];
        if (score.is_archived) {
          // 🔄 restore instead of blocking
          const restoreQuery = `
          UPDATE subject_scores
          SET is_archived = 0, items = ?, exam_date = ?
          WHERE score_id = ?
        `;
          return db.query(
            restoreQuery,
            [items, exam_date, score.score_id],
            (err2) => {
              if (err2)
                return res
                  .status(500)
                  .json({ message: "Server error", error: err2.message });
              return res.json({
                message: "Archived exam restored",
                score_id: score.score_id,
              });
            }
          );
        }

        // already exists & active → block
        return res.status(409).json({ message: "Exam already exists." });
      }

      // no match → insert new
      const insertQuery = `
      INSERT INTO subject_scores 
      (subject_id, university_id, exam_type, mode, items, exam_date, is_archived)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

      db.query(
        insertQuery,
        [subject_id, university_id, exam_type, mode, items, exam_date],
        (err2, result) => {
          if (err2)
            return res
              .status(500)
              .json({ message: "Server error", error: err2.message });

          res.status(201).json({ score_id: result.insertId, ...req.body });
        }
      );
    }
  );
});

// ✅ DELETE
router.delete("/:id", (req, res) => {
  const score_id = req.params.id;
  const query = "DELETE FROM subject_scores WHERE score_id = ?";
  db.query(query, [score_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Subject score deleted successfully" });
  });
});

// ✅ UPDATE
router.put("/:id", (req, res) => {
  const score_id = req.params.id;
  const { items } = req.body;

  const query = `
    UPDATE subject_scores
    SET items = ?
    WHERE score_id = ?
  `;

  db.query(query, [items, score_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subject score not found" });
    }
    res.json({ message: "Subject score updated successfully" });
  });
});

module.exports = router;
