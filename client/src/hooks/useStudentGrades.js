// src/hooks/useStudentGrades.js
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

/**
 * Build table rows combining students, subjects, and grades.
 * Each row represents one student with their grades in each subject.
 */
const buildRows = (students, subjects, grades) => {
  const gradeMap = new Map();
  // Map grades by student_id + score_id for fast lookup
  grades.forEach(g => gradeMap.set(`${g.student_id}_${g.score_id}`, g));

  return students.map(s => {
    const row = {
      id: s.student_id,
      studentName: `${s.last_name}, ${s.first_name} ${s.middle_name ?? ""} ${s.suffix ?? ""}`.trim(),
    };

    // Add one column per subject
    subjects.forEach(subj => {
      const g = gradeMap.get(`${s.student_id}_${subj.score_id}`);
      // ⚠️ Using subject_name as field key assumes it's unique
      // Consider using `score_${subj.score_id}` to avoid collisions
      row[subj.subject_name] = g ? g.score : "";
      row[`_score_id_${subj.subject_name}`] = subj.score_id; // store score_id for saving later
    });

    return row;
  });
};

/**
 * Build table columns based on subjects.
 */
const buildColumns = (subjects) => {
  const cols = [{ field: "studentName", headerName: "Student Name", width: 250 }];
  const addedSubjects = new Set();

  subjects.forEach(sub => {
    if (!addedSubjects.has(sub.subject_name)) {
      cols.push({
        // ⚠️ same as above: better use field: `score_${sub.score_id}`
        field: sub.subject_name,
        headerName: `${sub.subject_name} (${sub.items ?? ""})`,
        width: 150,
        editable: true,
        type: "number",
      });
      addedSubjects.add(sub.subject_name);
    }
  });

  return cols;
};

/**
 * Custom hook for fetching and managing student grades.
 * @param {string} mode - "onsite" or "inhouse"
 * @param {number|null} universityId - Required if mode is "inhouse"
 */
const useStudentGrades = (mode, universityId = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [raw, setRaw] = useState({ students: [], subjects: [], grades: [] });

  /**
   * Save multiple grades to the backend
   */
  const saveGrades = async (grades) => {
    try {
      const res = await axios.post(`http://localhost:5202/api/student_grades/bulk`, grades);
      return res.data;
    } catch (err) {
      console.error("Error saving grades:", err);
      throw err.response?.data || { error: "Unknown error" };
    }
  };

  /**
   * Fetch students + subjects + grades table from backend
   */
  const fetchData = useCallback(() => {
    if (!mode) return;

    setLoading(true);
    setError(null);

    let url = "";
    if (mode.toLowerCase() === "onsite") {
      url = `http://localhost:5202/api/student_grades/table_by_mode/onsite`;
    } else if (mode.toLowerCase() === "inhouse") {
      if (!universityId) {
        console.warn("University ID is required for Inhouse students");
        setError("University ID is required for inhouse mode"); // ⚠️ optional: show error in UI
        setLoading(false);
        return;
      }
      url = `http://localhost:5202/api/student_grades/table_by_mode/inhouse?universityId=${universityId}`;
    }

    axios
      .get(url)
      .then(res => {
        const { students = [], subjects = [], grades = [] } = res.data;
        setRaw({ students, subjects, grades });
        setColumns(buildColumns(subjects));
        setRows(buildRows(students, subjects, grades));
      })
      .catch(err => {
        console.error("Failed to fetch grade table:", err);
        setError(err.response?.data?.error || err.message || "Failed");
      })
      .finally(() => setLoading(false));
  }, [mode, universityId]);

  /**
   * Fetch data when mode/universityId changes
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { loading, error, rows, setRows, columns, raw, refetch: fetchData, saveGrades };
};

export default useStudentGrades;
