import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

export default function StudentForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    university_name: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5202/api/students", {
        ...formData,
        add_date: new Date().toISOString().split("T")[0],
      });
      onSuccess(); // Refresh table
      onClose(); // Close dialog
    } catch (err) {
      console.error("Student creation failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Student</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            required
            name="first_name"
            label="First Name"
            margin="normal"
            value={formData.first_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="middle_name"
            label="Middle Name"
            margin="normal"
            value={formData.middle_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            name="last_name"
            label="Last Name"
            margin="normal"
            value={formData.last_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="suffix"
            label="Suffix"
            margin="normal"
            value={formData.suffix}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="university_name"
            label="University Name"
            margin="normal"
            value={formData.university_name}
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
