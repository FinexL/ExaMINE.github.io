import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import api from "../../../api/axios";
import SuccessSnackbar from "../../../components/alerts/SuccessSnackbar";
import ErrorSnackbar from "../../../components/alerts/ErrorSnackbar";

const roles = ["Admin", "User"];
const statuses = ["Active", "Inactive"];

const AddUserForm = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  });

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", formData, { withCredentials: true });
      setSuccessOpen(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err.response || err);
      setErrorMessage(err.response?.data?.message || "Failed to add user");
      setErrorOpen(true);
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "User",
      status: "Active",
    });
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  label="Username"
                  fullWidth
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  fullWidth
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="role"
                  label="Role"
                  select
                  fullWidth
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts */}
      <SuccessSnackbar
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="User added successfully!"
      />
      <ErrorSnackbar
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={errorMessage}
      />
    </>
  );
};

export default AddUserForm;
