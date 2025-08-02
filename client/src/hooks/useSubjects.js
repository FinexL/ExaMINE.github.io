import { useState, useEffect } from "react";
import axios from "axios";

const useSubjects = () => {
  const [rows, setRows] = useState([]); // Always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5202/api/subjects");

        if (Array.isArray(res.data)) {
          setRows(res.data);
        } else {
          console.error("Expected array but got:", res.data);
          setRows([]);
        }

      } catch (err) {
        console.error("Failed to load subjects:", err);
        setError("Failed to load subjects.");
        setRows([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { rows, loading, error };
};

export default useSubjects;
