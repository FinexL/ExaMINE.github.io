import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import api from "../../../api/axios";
import SuccessSnackbar from "../../../components/alerts/SuccessSnackbar";
import ErrorSnackbar from "../../../components/alerts/ErrorSnackbar";
import useUsers from "../../../hooks/useUsers";

const roles = ["Admin", "User"];

export default function EditUserForm({ open, onClose, onSuccess, user }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",

    password: "",
  });
  const { users, profile } = useUsers();
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "User",

        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Submit form (PUT request)
  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Always use /users/:userId
      const endpoint = `/users/${user.user_id}`;

      await api.put(endpoint, formData, { withCredentials: true });

      setSuccessOpen(true);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      setErrorMsg(err.response?.data?.message || "Failed to update user");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            {profile?.user_role === "Admin" && (
              <TextField
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="New Password (optional)"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts */}
      <SuccessSnackbar
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="User updated successfully!"
      />
      <ErrorSnackbar
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={errorMsg}
      />
    </>
  );
}
