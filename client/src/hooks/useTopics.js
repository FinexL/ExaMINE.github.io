import { useEffect, useState } from "react";
import axios from "axios";

const useTopics = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5202/api/topics");
      setRows(response.data);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
      setError("Failed to load topic data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const saveTopic = async (topic) => {
    try {
      if (topic.isNew) {
        const res = await axios.post("http://localhost:5202/api/topics", topic);
        return res.data;
      } else {
        await axios.put(`http://localhost:5202/api/topics/${topic.topic_id}`, topic);
        return topic;
      }
    } catch (err) {
      console.error("Failed to save topic:", err);
      throw err;
    }
  };

  const deleteTopic = async (id) => {
    try {
      await axios.delete(`http://localhost:5202/api/topics/${id}`);
      setRows((prev) => prev.filter((row) => row.topic_id !== id));
    } catch (err) {
      console.error("Failed to delete topic:", err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    rows,
    loading,
    error,
    fetchTopics,
    saveTopic,
    deleteTopic,
    setRows,
  };
};

export default useTopics;
