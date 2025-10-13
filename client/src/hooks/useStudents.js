import { useEffect, useState } from "react";
import api from "../api/axios";

const useStudents = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/students");
      setRows(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  const saveStudent = async (student) => {
    if (!student.student_id || student.isNew) {
      const res = await api.post("/students", student,{ withCredentials: true });
      return res.data;
    } else {
      await api.put(`/students/${student.student_id}`, student);
      return student;
    }
  };

  const deleteStudent = async (id) => {
    await api.delete(`/students/${id}`);
    setRows((prev) => prev.filter((row) => row.student_id !== id));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

 const formattedStudents = rows.map((s) => ({
  full_name: `${s.last_name}, ${s.first_name} ${s.middle_name ?? ""} ${s.suffix ?? ""}`.trim(),
}));

  return {
    rows,
    loading,
    error,
    fetchStudents,
    saveStudent,
    deleteStudent,
    setRows,
    formattedStudents
  };
};

export default useStudents;
