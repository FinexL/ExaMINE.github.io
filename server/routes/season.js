const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/current", (req, res) => {
  db.query(
    "SELECT season_name FROM seasons WHERE CURDATE() BETWEEN start_date AND end_date LIMIT 1",
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      if (rows.length === 0) return res.json({ message: "No active season" });

      res.json(rows[0]);
    }
  );
});

module.exports = router;
