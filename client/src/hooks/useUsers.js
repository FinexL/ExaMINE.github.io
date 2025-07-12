import { useEffect, useState } from "react";
import axios from "axios";

const useUsers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5202/api/users");
      setRows(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (user) => {
    try {
      if (user.isNew) {
        const res = await axios.post("http://localhost:5202/api/users", user);
        return res.data;
      } else {
        await axios.put(
          `http://localhost:5202/api/users/${user.user_id}`,
          user
        );
        return user;
      }
    } catch (err) {
      console.error("Failed to save user:", err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5202/api/users/${id}`);
      setRows((prev) => prev.filter((row) => row.user_id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    rows,
    loading,
    error,
    fetchUsers,
    saveUser,
    deleteUser,
    setRows,
  };
};

export default useUsers;
