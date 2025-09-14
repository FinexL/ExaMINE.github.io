// src/components/forms/ExamForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";

export default function ExamForm({
  open,
  onClose,
  onSuccess,
  examType,
  mode,
  universityId, // ✅ new prop
}) {
  const [formData, setFormData] = useState({
    subject_id: "",
    items: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject_id) {
      setSnackbarMessage("Please select a subject.");
      setErrorSnackbarOpen(true);
      return;
    }

    if (!formData.items || isNaN(Number(formData.items))) {
      setSnackbarMessage("Please enter a valid number of items.");
      setErrorSnackbarOpen(true);
      return;
    }

    try {
      await axios.post("http://localhost:5202/api/subject_scores", {
        ...formData,
        university_id: universityId, // ✅ from prop
        exam_type: examType,
        mode: mode,
        exam_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      });

      setSnackbarMessage("Exam added successfully!");
      setSuccessSnackbarOpen(true);
      onSuccess?.();
      onClose?.();
      setFormData({ subject_id: "", items: "" });
    } catch (err) {
      setSnackbarMessage("Failed to create exam.");
      setErrorSnackbarOpen(true);
      console.error("Exam creation failed:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add New Exam</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Autocomplete
              options={subjects}
              getOptionLabel={(option) => option.subject_name || ""}
              value={
                formData.subject_id
                  ? subjects.find(
                      (s) => s.subject_id === formData.subject_id
                    ) || null
                  : null
              }
              onChange={(e, value) =>
                setFormData((prev) => ({
                  ...prev,
                  subject_id: value ? value.subject_id : "",
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subject"
                  margin="normal"
                  fullWidth
                />
              )}
            />

            <TextField
              fullWidth
              required
              name="items"
              label="Items"
              margin="normal"
              value={formData.items}
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
