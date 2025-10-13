import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import useUsers from "../../../hooks/useUsers";
import UserCard from "../cards/UserCards";
import EditUserForm from "../forms/EditUserForm";
import AddUserForm from "../forms/AddUserForm";
import AddButton from "../../../components/buttons/AddButton";
import api from "../../../api/axios";
import { getProfile } from "../../../utils/api";

const UserTable = () => {
  const { users, setUsers } = useUsers();
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const profile = await getProfile();
      if (profile) {
        setCurrentUser(profile);
        console.log("Current user:", profile); // <-- log current user here
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const profile = await getProfile();
      if (profile) setCurrentUser(profile);
    };
    fetchCurrentUser();
  }, []);

  // ✅ Handle Add User
  const handleAddClick = () => {
    setEditingUser(null);
    setIsAddMode(true);
    setFormOpen(true);
  };

  // ✅ Handle Edit User
  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsAddMode(false);
    setFormOpen(true);
  };

  // ✅ Refresh list after Add/Edit
  const handleFormSuccess = async () => {
    try {
      const res = await api.get("/users", { withCredentials: true });
      const normalized = res.data.map((u) => ({
        user_id: u.user_id,
        username: u.user_name,
        email: u.user_email,
        role: u.user_role,
        status: u.user_status,
      }));
      setUsers(normalized);
    } catch (err) {
      console.error("Failed to refresh users:", err);
    }
  };

  // ✅ Handle Status Toggle (Active/Inactive)
  const handleStatusChange = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.user_id === userId ? { ...u, status: newStatus } : u))
    );
  };

  return (
    <Box>
      {/* ✅ Conditional Form Rendering */}
      {isAddMode ? (
        <AddUserForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <EditUserForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
          user={editingUser}
        />
      )}

      {/* ✅ Add Button (Right-aligned) */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <AddButton onClick={handleAddClick} label="Add User" />
      </Box>

      {/* ✅ User Cards */}
      {currentUser && users.length > 0 ? (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {users.map((user) => (
            <UserCard
              key={user.user_id}
              user={user}
              currentUser={currentUser}
              onEdit={() => handleEditClick(user)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Loading users...
        </Typography>
      )}
    </Box>
  );
};

export default UserTable;
