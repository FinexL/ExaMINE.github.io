import { useState } from "react";
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

export default function UniversityForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    university_name: "",
    dean_name: "",
    dean_email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5202/api/universities", {
        ...formData,
      });
      onSuccess();
      onClose();
      setFormData({
        university_name: "",
        dean_name: "",
        dean_email: "",
      });
    } catch (err) {
      console.error("University creation failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add University</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            required
            name="university_name"
            label="University Name"
            fullWidth
            margin="normal"
            value={formData.university_name}
            onChange={handleChange}
          />

          <TextField
            name="dean_name"
            label="Dean Name"
            fullWidth
            margin="normal"
            value={formData.dean_name}
            onChange={handleChange}
          />
          <TextField
            name="dean_email"
            label="Dean Email"
            fullWidth
            margin="normal"
            value={formData.dean_email}
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
