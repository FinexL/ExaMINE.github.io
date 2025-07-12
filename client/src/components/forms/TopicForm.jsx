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

export default function TopicForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic_name: "",
    subject_name: "",
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
      await axios.post("http://localhost:5202/api/topics", {
        ...formData,
        add_date: new Date().toISOString().split("T")[0],
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Topic creation failed:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Topic</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            required
            name="topic_name"
            label="Topic Name"
            margin="normal"
            value={formData.topic_name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            multiline
            name="subject_name"
            label="Subject Name"
            margin="normal"
            value={formData.subject_name}
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
