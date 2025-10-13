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
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";
import api from "../../api/axios";

export default function StudentForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    university_id: "",
    modes: "",
  });

  const [universities, setUniversities] = useState([]);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [availableModes, setAvailableModes] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await api.get("/universities");
        setUniversities(res.data);
      } catch (err) {
        console.error("Failed to load universities:", err);
      }
    };
    fetchUniversities();
  }, []);

  // Update available modes when university changes
  useEffect(() => {
    if (formData.university_id) {
      const uni = universities.find(
        (u) => u.university_id === formData.university_id
      );
      if (uni) {
        setAvailableModes([uni.modes]);
        setFormData((prev) => ({ ...prev, modes: "" }));
      }
    } else {
      setAvailableModes([]);
      setFormData((prev) => ({ ...prev, modes: "" }));
    }
  }, [formData.university_id, universities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.first_name.trim()) missingFields.push("First name");
    if (!formData.last_name.trim()) missingFields.push("Last name");
    if (!formData.university_id) missingFields.push("School");
    if (!formData.modes) missingFields.push("Mode");

    if (missingFields.length > 0) {
      const message =
        missingFields.length === 1
          ? `${missingFields[0]} is required`
          : `${missingFields.slice(0, -1).join(", ")} and ${missingFields.slice(
              -1
            )} are required`;
      setSnackbarMessage(message);
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      await api.post("/students", formData, {
        withCredentials: true,
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
        modes: "",
      });
    } catch (err) {
      console.error("Student creation failed:", err);
      setSnackbarMessage("Failed to create student.");
      setErrorSnackbarOpen(true);
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
              {["", "Jr.", "Sr.", "II", "III", "IV", "V"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s || "None"}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              required
              name="university_id"
              label="School"
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

            <TextField
              select
              fullWidth
              required
              name="modes"
              label="Mode"
              margin="normal"
              value={formData.modes}
              onChange={handleChange}
            >
              {availableModes.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  {mode}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
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
