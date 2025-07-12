
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5202;

app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

//sql file
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Capstone2025",
  database: "examine_db"
});

//retrieve student
app.get("/api/students", (req, res) => {
  const query = `
    SELECT
      s.student_id,
      s.first_name,
      s.middle_name,
      s.last_name,
      s.suffix,
      s.university_id,
      u.university_name,
      DATE_FORMAT(s.add_date, '%Y-%m-%d') AS add_date
    FROM students s
    LEFT JOIN universities u ON s.university_id = u.university_id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// retrieve univeristy
app.get('/api/universities', (req, res) => {
  db.query('SELECT * FROM universities', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// retrieve subject
app.get('/api/subjects', (req, res) => {
  db.query('SELECT * FROM subjects', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// retrieve topic
    app.get('/api/topics', (req, res) => {
    const query = `
        SELECT 
        t.topic_id,
        t.topic_name,
        s.subject_name
        FROM topics t
        LEFT JOIN subjects s ON t.subject_id = s.subject_id
    `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// retrieve user
app.get('/api/users', (req, res) => {
    const query = `
    SELECT 
      user_id,
      user_name,
      user_role,
      user_status,
      user_email,
      DATE_FORMAT(add_date, '%Y-%m-%d') AS add_date,
      DATE_FORMAT(last_login, '%Y-%m-%d') AS last_login
    FROM users
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//add other crud 07/10
//create
//update
//delete

// pangstart. dont touch this
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
