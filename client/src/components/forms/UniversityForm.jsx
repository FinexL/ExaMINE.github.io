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
    name: "",
    number_of_students: "",
    dean: "",
    dean_email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5202/api/universities", {
        ...formData,
        add_date: new Date().toISOString().split("T")[0],
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add University</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="University Name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          name="dean"
          label="Dean"
          fullWidth
          margin="normal"
          value={formData.dean}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
