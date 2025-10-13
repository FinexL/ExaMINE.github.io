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
        const response = await axios.get("/api/subject_scores");
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
    const response = await axios.post("/api/subject_scores", newScore, { withCredentials: true });
    setSubjectScores((prev) => [...prev, response.data]);
  } catch (err) {
    if (err.response?.status === 409) {
      alert("This exam already exists for this subject/university/mode.");
    } else {
      setError(err);
    }
  }
};


    // Update existing subject score
   const updateSubjectScore = async (id, updatedScore) => {
  try {
    await axios.put(`/api/subject_scores/${id}`, updatedScore);
    setSubjectScores((prev) =>
      prev.map((s) => (s.score_id === id ? { ...s, ...updatedScore } : s))
    );
  } catch (err) {
    setError(err);
  }
};

    // Delete subject score
    const deleteSubjectScore = async (id) => {
      try {
        await axios.delete(`/api/subject_scores/${id}`);
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
