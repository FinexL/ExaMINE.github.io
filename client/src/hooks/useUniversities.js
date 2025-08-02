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
      console.error("Fetch error:", err);
      setError("Unable to fetch university data.");
    } finally {
      setLoading(false);
    }
  };

 const saveUniversity = async (row) => {
  try {
    const { number_of_students, ...cleanRow } = row;

    if (!row.university_id || row.isNew) {
      const res = await axios.post("http://localhost:5202/api/universities", cleanRow);
      setRows((prev) => [...prev, { ...res.data, ...cleanRow }]);
      return res.data;
    } else {
      await axios.put(`http://localhost:5202/api/universities/${row.university_id}`, cleanRow);
      setRows((prev) =>
        prev.map((r) => (r.university_id === row.university_id ? { ...r, ...cleanRow } : r))
      );
      return row;
    }
  } catch (err) {
    console.error("Save failed:", err.response?.data || err.message);
    throw err;
  }
};



  const deleteUniversity = async (id) => {
    try {
      await axios.delete(`http://localhost:5202/api/universities/${id}`);
      setRows((prev) => prev.filter((r) => r.university_id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
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
