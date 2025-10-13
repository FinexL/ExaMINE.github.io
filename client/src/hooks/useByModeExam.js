// src/hooks/useByModeExam.js
import { useState, useEffect } from "react";
import axios from "axios";

export default function useByModeExam(mode, examType, universityId = null) {
  const [scores, setScores] = useState([]); // default empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        const params = { mode, exam_type: examType };
        if (universityId) params.university_id = universityId;

        const response = await axios.get("/api/subject_scores/by-mode-exam", {
          params,
        });

        setScores(Array.isArray(response.data) ? response.data : []); // ensure array
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchScores();
  }, [mode, examType, universityId]);

  return { scores, loading, error };
}
