const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all grade sheets
router.get("/", (req, res) => {
    const query = `
    SELECT
    grading_id INT PRIMARY KEY AUTO_INCREMENT,
student_id INT NOT NULL,
score_id INT NOT NULL,
exam_type VARCHAR(50),
score DECIMAL (5,2) NOT NULL,
grade_status VARCHAR(20),
FOREIGN KEY (score_id) REFERENCES topic_scores(score_id),
FOREIGN KEY (student_id) REFERENCES students(student_id )
)`;
db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;