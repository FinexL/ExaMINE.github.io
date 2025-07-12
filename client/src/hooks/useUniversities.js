import { useEffect, useState } from "react";
import axios from "axios";

const useUniversities = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUniversities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5202/api/universities");
      setRows(res.data);
    } catch (err) {
      console.error("Failed to fetch universities:", err);
      setError("Failed to load university data.");
    } finally {
      setLoading(false);
    }
  };

  const saveUniversity = async (row) => {
    try {
      if (row.isNew) {
        const res = await axios.post("http://localhost:5202/api/universities", row);
        return res.data;
      } else {
        await axios.put(`http://localhost:5202/api/universities/${row.university_id}`, row);
        return row;
      }
    } catch (err) {
      console.error("Save university failed:", err);
      throw err;
    }
  };

  const deleteUniversity = async (id) => {
    try {
      await axios.delete(`http://localhost:5202/api/universities/${id}`);
      setRows((prev) => prev.filter((row) => row.university_id !== id));
    } catch (err) {
      console.error("Delete university failed:", err);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  return {
    rows,
    loading,
    error,
    fetchUniversities,
    saveUniversity,
    deleteUniversity,
    setRows,
  };
};

export default useUniversities;