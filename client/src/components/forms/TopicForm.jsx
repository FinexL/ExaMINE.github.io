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
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";

export default function TopicForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic_name: "",
    subject_id: "",
  });

  const [subjects, setSubjects] = useState([]);

  const [SuccessSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [ErrorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let missingFields = [];

    if (!formData.topic_name.trim()) missingFields.push("Topic name");
    if (!formData.subject_id) missingFields.push("Subject");

    if (missingFields.length > 0) {
      const message =
        missingFields.length === 1
          ? `${missingFields[0]} is required`
          : `${missingFields.slice(0, -1).join(", ")} and ${
              missingFields[missingFields.length - 1]
            } are required`;

      setSnackbarMessage(message);
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      await axios.post("http://localhost:5202/api/topics", {
        ...formData,
      });
      setSnackbarMessage("Topic added successfully!");
      setSuccessSnackbarOpen(true);
      onSuccess();
      onClose();
      setFormData({
        topic_name: "",
        subject_id: "",
      });
    } catch (err) {
      setSnackbarMessage("Failed to create topic.");
      setErrorSnackbarOpen(true);
      console.error("Topic creation failed:", err);
    }
  };

  return (
    <>
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

      <SuccessSnackbar
        open={SuccessSnackbarOpen}
        message={snackbarMessage}
        onClose={() => setSuccessSnackbarOpen(false)}
      />
      <ErrorSnackbar
        open={ErrorSnackbarOpen}
        message={snackbarMessage}
        onClose={() => setErrorSnackbarOpen(false)}
      />
    </>
  );
}
