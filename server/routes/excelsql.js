const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql2/promise');

const upload = multer({ dest: 'uploads/' });


router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const connection = await mysql.createConnection(dbConfig);

    // Fetch existing students and subjects
    const [students] = await connection.query(`
      SELECT student_id, first_name, middle_name, last_name, suffix
      FROM students
    `);
    const [subjects] = await connection.query(`
      SELECT subject_id, subject_name, subject_code
      FROM subjects
    `);

    // Build full names for matching
    const studentsWithFullName = students.map(s => ({
      ...s,
      fullName: `${s.first_name} ${s.middle_name ? s.middle_name + ' ' : ''}${s.last_name}${s.suffix ? ', ' + s.suffix : ''}`.trim()
    }));

    const mappedRows = [];
    const unmatchedStudents = new Set();
    const unmatchedSubjects = new Set();

    for (const row of jsonData) {
      const student = studentsWithFullName.find(
        s => s.fullName.toLowerCase() === row.student_name.toLowerCase()
      );

      const subject = subjects.find(s => 
  (row.subject_code && s.subject_code.toLowerCase() === row.subject_code.toLowerCase()) ||
  (row.subject_name && s.subject_name.toLowerCase() === row.subject_name.toLowerCase())
);


      if (!student) unmatchedStudents.add(row.student_name);
      if (!subject) unmatchedSubjects.add(row.subject_name|| row.subject_code);

      mappedRows.push({
        ...row,
        student_id: student ? student.student_id : null,
        subject_id: subject ? subject.subject_id : null,
      });
    }

    // Optionally: Upsert into subject_scores for matched rows
    for (const row of mappedRows) {
      if (row.student_id && row.subject_id) {
        await connection.query(
          `INSERT INTO subject_scores (student_id, subject_id, score)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE score = VALUES(score)`,
          [row.student_id, row.subject_id, row.score || null]
        );
      }
    }

    await connection.end();

    res.json({
      mappedRows,
      unmatchedStudents: Array.from(unmatchedStudents),
      unmatchedSubjects: Array.from(unmatchedSubjects),
      message: 'Excel processed and matched rows inserted/updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process Excel', error: err.message });
  }
});

module.exports = router;
