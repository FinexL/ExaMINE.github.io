import { useState, useEffect } from "react";
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

export default function UniversityForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    university_name: "",
    dean_name: "",
    dean_email: "",
    modes: "",
  });

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let missingFields = [];

    if (!formData.university_name.trim()) missingFields.push("University name");
    if (!formData.modes) missingFields.push("Modes");

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
      await axios.post("http://localhost:5202/api/universities", formData);
      setSnackbarMessage("University created successfully.");
      setSuccessSnackbarOpen(true);
      onSuccess();
      onClose();
      setFormData({
        university_name: "",
        dean_name: "",
        dean_email: "",
        modes: "",
      });
    } catch (err) {
      if (err.response?.data?.code === "ER_DUP_ENTRY") {
        setSnackbarMessage(
          "University name already exists. Please use a different name."
        );
      } else {
        setSnackbarMessage("Failed to create university.");
      }
      setErrorSnackbarOpen(true);
      console.error("University creation failed:", err);
    }
  };

  return (
    <>
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

            <TextField
              select
              fullWidth
              required
              name="modes"
              label="Modes"
              margin="normal"
              value={formData.modes}
              onChange={handleChange}
            >
              <MenuItem value="Onsite">Onsite</MenuItem>
              <MenuItem value="Inhouse">Inhouse</MenuItem>
              <MenuItem value="Onsite & Inhouse">Onsite & Inhouse</MenuItem>
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
        open={successSnackbarOpen}
        message={snackbarMessage}
        onClose={() => setSuccessSnackbarOpen(false)}
      />
      <ErrorSnackbar
        open={errorSnackbarOpen}
        message={snackbarMessage}
        onClose={() => setErrorSnackbarOpen(false)}
      />
    </>
  );
}
