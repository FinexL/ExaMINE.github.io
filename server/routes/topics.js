const express = require("express");
const router = express.Router();
const db = require("../config/db");

//GET ALL topics
router.get("/", (req, res) => {
  const query = `
    SELECT 
      t.topic_id,
      t.topic_name,
      t.subject_id,
      s.subject_name
    FROM topics t
    LEFT JOIN subjects s ON t.subject_id = s.subject_id
    ORDER BY s.subject_name
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.post("/", (req, res) => {
  const { topic_name, subject_id } = req.body;

  if (!topic_name || !topic_name.trim() || !subject_id) {
    return res.status(400).json({ error: "Topic and Subject are required." });
  }

  const query = `
  INSERT INTO topics 
  (topic_name, subject_id) 
  VALUES (?, ?)
`;

db.query(query, [topic_name, subject_id], (err, result) => {
  if (err) return res.status(500).json({ error: err.message });

  const newTopicId = result.insertId;

  const fetchInserted = `
    SELECT 
      t.topic_id,
      t.topic_name,
      t.subject_id,
      s.subject_name
    FROM topics t
    LEFT JOIN subjects s ON t.subject_id = s.subject_id
    WHERE t.topic_id = ?
  `;

  db.query(fetchInserted, [newTopicId], (err2, results) => {
    if (err2) return res.status(500).json({ error: err2.message });
    res.status(201).json(results[0]);
  });
});

});


// PUT update topic
router.put("/:id", (req, res) => {
  const topic_id = req.params.id;
  const {
    topic_name,
    subject_id,
  } = req.body;

if (!topic_name || !topic_name.trim() || !subject_id) 
 {
    return res.status(400).json({ error: "Topic and Subject are required." });
  }
  const query = `
    UPDATE topics SET
      
      topic_name = ?, 
      subject_id = ?
    WHERE topic_id = ?
  `;
  db.query(
    query,
    [topic_name, subject_id, topic_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const fetchUpdated = `
  SELECT 
    t.topic_id,
    t.topic_name,
    t.subject_id,
    s.subject_name
  FROM topics t
  LEFT JOIN subjects s ON t.subject_id = s.subject_id
  WHERE t.topic_id = ?
  ORDER BY s.subject_name
`;


      db.query(fetchUpdated, [topic_id], (err2, results) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(results[0]); 
      });
    }
  );
});

// DELETE topic
router.delete("/:id", (req, res) => {
  const topic_id = req.params.id;

  const query = "DELETE FROM topics WHERE topic_id = ?";
  db.query(query, [topic_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Topic deleted" });
  });
});


module.exports = router;
