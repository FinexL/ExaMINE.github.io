import { useState, useEffect } from "react";
import api from "../api/axios";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Fetch user profile first
        const profileRes = await api.get("/users/profile", {
          withCredentials: true,
        });
        const userProfile = profileRes.data;

        setProfile(userProfile);

        // Only admins can view all users
        if (userProfile.user_role === "Admin") {
          const res = await api.get("/users", { withCredentials: true });
          const normalized = res.data.map((u) => ({
            user_id: u.user_id,
            username: u.user_name,
            email: u.user_email,
            role: u.user_role,
            status: u.user_status,
          }));

          setUsers(normalized);
        } else {
          // Non-admin users only see their own account
          setUsers([
            {
              user_id: userProfile.user_id,
              username: userProfile.user_name,
              email: userProfile.user_email,
              role: userProfile.user_role,
              status: userProfile.user_status,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching users:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, setUsers, profile, loading, error };
}
