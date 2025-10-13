import { useState, useEffect } from "react";
import api from "../api/axios";

export default function useGradeCriteria(mode) {
  const [criteria, setCriteria] = useState({
    red: 0,
    yellow: 0,
    green: 0,
    white: 0,
  });
  const [error, setError] = useState(null);

  // Fetch criteria
  useEffect(() => {
    if (!mode) return;

    api
      .get(`/grade_criteria/${mode}`)
      .then((res) => {
        if (res.data.error) throw new Error(res.data.error);
        setCriteria(res.data);
      })
      .catch((err) => setError(err.message));
  }, [mode]);

  const updateCriteria = async (newCriteria) => {
    try {
      await api.put(
        `/grade_criteria/${mode}`,
        newCriteria
      );
      setCriteria(newCriteria);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { criteria, setCriteria, updateCriteria, error };
}
