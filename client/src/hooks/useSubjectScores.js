import { useState, useEffect } from "react";
import axios from "axios";

export default function useSubjectScores() {
  const [subjectScores, setSubjectScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all subject scores
  const fetchSubjectScores = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/subject-scores");
      setSubjectScores(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // Add new subject score
  const addSubjectScore = async (newScore) => {
    try {
      const response = await axios.post("/api/subject-scores", newScore);
      setSubjectScores((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err);
    }
  };

  // Update existing subject score
  const updateSubjectScore = async (id, updatedScore) => {
    try {
      const response = await axios.put(`/api/subject-scores/${id}`, updatedScore);
      setSubjectScores((prev) =>
        prev.map((score) => (score.score_id === id ? response.data : score))
      );
    } catch (err) {
      setError(err);
    }
  };

  // Delete subject score
  const deleteSubjectScore = async (id) => {
    try {
      await axios.delete(`/api/subject-scores/${id}`);
      setSubjectScores((prev) => prev.filter((score) => score.score_id !== id));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchSubjectScores();
  }, []);

  return {
    subjectScores,
    loading,
    error,
    fetchSubjectScores,
    addSubjectScore,
    updateSubjectScore,
    deleteSubjectScore,
  };
}
