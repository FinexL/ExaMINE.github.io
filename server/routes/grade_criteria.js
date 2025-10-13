const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:mode", (req, res) => {
  const { mode } = req.params;

  db.query(
    `SELECT red_threshold AS red, yellow_threshold AS yellow, 
            green_threshold AS green, white_threshold AS white
     FROM grade_criteria
     WHERE mode = ?`,
    [mode],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length === 0) {
        return res.status(404).json({ error: "Criteria not found" });
      }

      res.json(rows[0]);
    }
  );
});
router.put("/:mode", (req, res) => {
  const { mode } = req.params;
  const { red, yellow, green, white } = req.body;

  db.query(
    `UPDATE grade_criteria
     SET red_threshold = ?, yellow_threshold = ?, green_threshold = ?, white_threshold = ?, last_updated = NOW()
     WHERE mode = ?`,
    [red, yellow, green, white, mode],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ success: true });
    }
  );
});


module.exports = router;

