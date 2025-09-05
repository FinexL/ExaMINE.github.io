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

export default function StudentForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    university_id: "",
  });

  const [universities, setUniversities] = useState([]);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get("http://localhost:5202/api/universities");
        setUniversities(res.data);
      } catch (err) {
        console.error("Failed to load universities:", err);
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let missingFields = [];

    if (!formData.first_name.trim()) missingFields.push("First name");
    if (!formData.last_name.trim()) missingFields.push("Last name");
    if (!formData.university_id) missingFields.push("University");

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
      await axios.post("http://localhost:5202/api/students", {
        ...formData,
      });
      setSnackbarMessage("Student added successfully!");
      setSuccessSnackbarOpen(true);
      onSuccess();
      onClose();
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        university_id: "",
      });
    } catch (err) {
      setSnackbarMessage("Failed to create student.");
      setErrorSnackbarOpen(true);
      console.error("Student creation failed:", err);
    }
  };

  return (
    <>
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
              select
              fullWidth
              name="suffix"
              label="Suffix"
              margin="normal"
              value={formData.suffix}
              onChange={handleChange}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Jr.">Jr.</MenuItem>
              <MenuItem value="Sr.">Sr.</MenuItem>
              <MenuItem value="II">II</MenuItem>
              <MenuItem value="III">III</MenuItem>
              <MenuItem value="IV">IV</MenuItem>
              <MenuItem value="V">V</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              required
              name="university_id"
              label="University"
              margin="normal"
              value={formData.university_id}
              onChange={handleChange}
            >
              {universities.map((uni) => (
                <MenuItem key={uni.university_id} value={uni.university_id}>
                  {uni.university_name}
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
