import { useEffect, useState } from "react";
import api from "../api/axios";

const useSubjects = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/subjects");
      setRows(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to fetch subject data.");
    } finally {
      setLoading(false);
    }
  };

  const saveSubject = async (row) => {
    try {
      const cleanRow = { ...row };

      Object.keys(cleanRow).forEach((key) => {
        if (cleanRow[key] === "") {
          cleanRow[key] = null;
        }
      });

      if (!row.subject_id || row.isNew) {
        
        const res = await api.post("/subjects", cleanRow, { withCredentials: true });
        setRows((prev) => [...prev, { ...res.data, ...cleanRow }]);
        return res.data;
      } else {
        
        await api.put(
          `/subjects/${row.subject_id}`,
          cleanRow
        );
        setRows((prev) =>
          prev.map((r) =>
            r.subject_id === row.subject_id ? { ...r, ...cleanRow } : r
          )
        );
        return row;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to save subject.";
      console.error("Save failed:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      setRows((prev) => prev.filter((r) => r.subject_id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete subject.";
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    rows,
    loading,
    error,
    fetchSubjects,
    saveSubject,
    deleteSubject,
    setRows,
  };
};

export default useSubjects;
