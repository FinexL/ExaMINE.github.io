const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
    const query = `
        SELECT 
        s.subject_id,
        s.subject_name
        FROM subjects s
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
    }
);

module.exports =router;