// hooks/useArchive.js
import { useState } from "react";
import api from "../api/axios";

export default function useArchive(baseUrl = "/archive") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to handle requests
  const request = async (callback) => {
    setLoading(true);
    setError(null);
    try {
      const result = await callback();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      throw err;
    }
  };

  // Archive rows
  const archive = (table, ids) =>
    request(() => api.post(`${baseUrl}/${table}/archive`, { ids }));

  // Unarchive rows
  const unarchive = (table, ids) =>
    request(() => api.post(`${baseUrl}/${table}/unarchive`, { ids }));

  // Fetch archived rows
  const fetchArchived = (table) =>
    request(() => api.get(`${baseUrl}/${table}`).then((res) => res.data));

  return {
    loading,
    error,
    archive,
    unarchive,
    fetchArchived,
  };
}
