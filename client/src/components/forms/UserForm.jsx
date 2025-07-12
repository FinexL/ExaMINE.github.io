import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";

export default function UserForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    user_name: "",
    user_role: "",

    user_email: "",
    user_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5202/api/users", {
        ...formData,
        add_date: new Date().toISOString().split("T")[0],
      });
      onSuccess();
    } catch (err) {
      console.error("User creation failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            required
            name="user_name"
            label="User Name"
            margin="normal"
            value={formData.user_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            name="user_role"
            label="User Role"
            margin="normal"
            value={formData.user_role}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            name="user_email"
            label="Email"
            margin="normal"
            value={formData.user_email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            name="user_password"
            label="Password"
            type="password"
            margin="normal"
            value={formData.user_password}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
