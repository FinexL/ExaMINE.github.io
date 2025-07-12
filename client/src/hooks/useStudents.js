import { useEffect, useState } from "react";
import axios from "axios";
//experimental hook for managing. soon combine all. make it more efficient and less file TT.TT
const useStudents = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5202/api/students");
      setRows(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const saveStudent = async (student) => {
    try {
      if (student.isNew) {
        const res = await axios.post("http://localhost:5202/api/students", student);
        return res.data;
      } else {
        await axios.put(`http://localhost:5202/api/students/${student.student_id}`, student);
        return student;
      }
    } catch (err) {
      console.error("Failed to save student:", err);
      throw err;
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5202/api/students/${id}`);
      setRows((prev) => prev.filter((row) => row.student_id !== id));
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    rows,
    loading,
    error,
    fetchStudents,
    saveStudent,
    deleteStudent,
    setRows,
  };
};

export default useStudents;