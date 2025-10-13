import { useEffect, useState } from "react";
import api from "../api/axios";

const useUniversities = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUniversities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/universities");
      setRows(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to fetch university data.");
    } finally {
      setLoading(false);
    }
  };

 const saveUniversity = async (row) => {
  try {
    const { number_of_students, ...cleanRow } = row;

    Object.keys(cleanRow).forEach((key) => {
      if (cleanRow[key] === "") {
        cleanRow[key] = null;
      }
    });

    if (!row.university_id || row.isNew) {
      const res = await api.post("/universities", cleanRow, { withCredentials: true });
      setRows((prev) => [...prev, { ...res.data, ...cleanRow }]);
      return res.data;
    } else {
      await api.put(
        `/universities/${row.university_id}`,
        cleanRow
      );
      setRows((prev) =>
        prev.map((r) =>
          r.university_id === row.university_id ? { ...r, ...cleanRow } : r
        )
      );
      return row;
    }
  } catch (err) {
  const errorMessage = err.response?.data?.error || "Failed to save university.";
  console.error("Save failed:", errorMessage);
  throw new Error(errorMessage);
  }
};



  const deleteUniversity = async (id) => {
    try {
      await api.delete(`/universities/${id}`);
      setRows((prev) => prev.filter((r) => r.university_id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete university.";
      throw new Error(errorMessage);
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
