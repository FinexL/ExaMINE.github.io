import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

const buildRows = (students, subjects, grades) => {
  const gradeMap = new Map();
  grades.forEach((g) => gradeMap.set(`${g.student_id}_${g.score_id}`, g));

  return students.map((s) => {
    const row = {
      id: s.student_id,
      student_id: s.student_id,
      studentName: `${s.last_name}, ${s.first_name} ${s.middle_name ?? ""} ${
        s.suffix ?? ""
      }`.trim(),
      university_name: s.university_name,
    };

    subjects.forEach((subj) => {
      const g = gradeMap.get(`${s.student_id}_${subj.score_id}`);
      row[`score_${subj.score_id}`] = g ? g.score : "";
    });

    return row;
  });
};

/**
 * Build table columns based on subjects.
 */
const buildColumns = (subjects) => {
  const cols = [
    { field: "studentName", headerName: "Student Name", width: 250 },
    { field: "university_name", headerName: "School", width: 300 },
  ];

  subjects.forEach((subj) => {
    cols.push({
      field: `score_${subj.score_id}`,
      headerName: `${subj.subject_name} (${subj.items ?? ""})`,
      width: 150,
      editable: true,
      type: "number",
    });
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
      const res = await api.post(`/student_grades/bulk`, grades);
      return res.data;
    } catch (err) {
      console.error("Error saving grades:", err);
      throw err.response?.data || { error: "Unknown error" };
    }
  };

  //Fetch students + subjects + grades table from backend
  const fetchData = useCallback(() => {
    if (!mode) return;

    setLoading(true);
    setError(null);

    let url = "";
    if (mode.toLowerCase() === "onsite") {
      url = `/student_grades/table_by_mode/onsite`;
    } else if (mode.toLowerCase() === "inhouse") {
      if (!universityId) {
        console.warn("University ID is required for Inhouse students");
        setError("University ID is required for inhouse mode");
        setLoading(false);
        return;
      }
      url = `/student_grades/table_by_mode/inhouse?universityId=${universityId}`;
    }

    api
      .get(url)
      .then((res) => {
        const { students = [], subjects = [], grades = [] } = res.data;
        setRaw({ students, subjects, grades });
        setColumns(buildColumns(subjects));
        setRows(buildRows(students, subjects, grades));
      })
      .catch((err) => {
        console.error("Failed to fetch grade table:", err);
        setError(err.response?.data?.error || err.message || "Failed");
      })
      .finally(() => setLoading(false));
  }, [mode, universityId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading,
    error,
    rows,
    setRows,
    columns,
    raw,
    refetch: fetchData,
    saveGrades,
  };
};

export default useStudentGrades;
