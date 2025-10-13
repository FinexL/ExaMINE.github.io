import { useState, useEffect } from "react";
import api from "../api/axios";

export default function useTop(universityId, limit = 10) {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!universityId) return;

    const fetchTopStudents = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/top/${universityId}?limit=${limit}`, {
          withCredentials: true,
        });

        setTopStudents(res.data.topStudents || []);
      } catch (err) {
        console.error("Error fetching top students:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch top students");
      } finally {
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, [universityId, limit]);

  return { topStudents, loading, error, setTopStudents };
}
