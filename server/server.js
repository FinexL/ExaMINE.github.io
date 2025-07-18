
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

//view
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


// ADD a student
app.post("/api/students", (req, res) => {
  console.log("Incoming student data:", req.body);
  const {
    first_name,
    middle_name,
    last_name,
    suffix,
    university_id,
    add_date
  } = req.body;

  const query = `
    INSERT INTO students 
    (first_name, middle_name, last_name, suffix, university_id, add_date) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [first_name, middle_name, last_name, suffix, university_id, add_date],
    (err, result) => {
      if (err) {
        console.error("INSERT error:", err); // 👈 More helpful error
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Student added", student_id: result.insertId });
    }
  );
});

// UPDATE a student
app.put("/api/students/:id", (req, res) => {
  const student_id = req.params.id;
  const {
    first_name,
    middle_name,
    last_name,
    suffix,
    university_id,
    add_date
  } = req.body;

  const query = `
    UPDATE students SET
      first_name = ?, 
      middle_name = ?, 
      last_name = ?, 
      suffix = ?, 
      university_id = ?, 
      add_date = ?
    WHERE student_id = ?
  `;

  db.query(query, [first_name, middle_name, last_name, suffix, university_id, add_date, student_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Student updated" });
  });
});

// DELETE a student
app.delete("/api/students/:id", (req, res) => {
  const student_id = req.params.id;

  const query = "DELETE FROM students WHERE student_id = ?";
  db.query(query, [student_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Student deleted" });
  });
});


// retrieve univeristy
app.get('/api/universities', (req, res) => {
  const query = `
    SELECT 
      u.university_id,
      u.university_name,
      COUNT(s.student_id) AS number_of_students,
      u.dean_name,
      u.dean_email
    FROM universities u
    LEFT JOIN students s ON u.university_id = s.university_id
    GROUP BY u.university_id, u.university_name, u.dean_name, u.dean_email
  `;
  db.query(query, (err, results) => {
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
