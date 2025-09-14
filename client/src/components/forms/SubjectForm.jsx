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
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";

export default function SubjectForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    subject_name: "",
    subject_code: "",
  });

  const [SuccessSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [ErrorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    if (!formData.subject_name.trim()) missingFields.push("Subject name");

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
      await axios.post("http://localhost:5202/api/subjects", {
        ...formData,
      });
      setSnackbarMessage("Subject added successfully!");
      setSuccessSnackbarOpen(true);
      onSuccess();
      onClose();
      setFormData({
        subject_name: "",
        subject_code: "",
      });
    } catch (err) {
      setSnackbarMessage("Failed to create subject.");
      setErrorSnackbarOpen(true);
      console.error("Subject creation failed:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add New Subject</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              required
              name="subject_name"
              label="Subject Name"
              margin="normal"
              value={formData.subject_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              name="subject_code"
              label="Subject Code"
              margin="normal"
              value={formData.subject_code}
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
