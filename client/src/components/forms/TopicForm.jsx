import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import axios from "axios";

export default function TopicForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic_name: "",
    subject_id: "",
  });

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5202/api/subjects");
        setSubjects(res.data);
      } catch (err) {
        console.error("Failed to load subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

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
      setFormData({
        topic_name: "",
        subject_id: "",
      });
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
          ></TextField>
          <TextField
            select
            fullWidth
            required
            name="subject_id"
            label="Subject"
            margin="normal"
            value={formData.subject_id}
            onChange={handleChange}
          >
            {subjects.map((sub) => (
              <MenuItem key={sub.subject_id} value={sub.subject_id}>
                {sub.subject_name}
              </MenuItem>
            ))}
          </TextField>
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
