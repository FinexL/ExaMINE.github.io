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

const examTypes = ["Prelim", "Midterm", "Finals"];

export default function ExamForm({ open, onClose, onSuccess, spreadsheetRef }) {
  const [formData, setFormData] = useState({
    subject_ide: "",
    subject_name: "",
    topic_id: "",
    topic_name: "",
    exam_type: "",
    total_points: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const [subRes, topRes] = await Promise.all([
          axios.get("http://localhost:5202/api/subjects"),
          axios.get("http://localhost:5202/api/topics"),
        ]);
        setSubjects(subRes.data);
        setTopics(topRes.data);
      } catch (err) {
        console.error("Error fetching subjects/topics:", err);
      }
    };
    fetchTopic();
  }, []);

  useEffect(() => {
    if (formData.subject_id) {
      setFilteredTopics(
        topics.filter((t) => t.subject_id === formData.subject_id)
      );
    } else {
      setFilteredTopics([]);
    }
  }, [formData.subject_id, topics]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let missingFields = [];

    if (!formData.topic_id) missingFields.push("Topic");
    if (!formData.exam_type.trim()) missingFields.push("Type");
    if (!formData.total_points.trim()) missingFields.push("Total Points");

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
      await axios.post("http://localhost:5202/api/exams", {
        topic_id: formData.topic_id,
        max_score: formData.total_points,
        exam_type: formData.exam_type,
      });

      // Update spreadsheet visually
      if (spreadsheetRef?.current) {
        const spreadsheet = spreadsheetRef.current;

        // Find the correct sheet based on exam_type
        const sheetIndex = spreadsheet.sheets.findIndex(
          (s) => s.name === formData.exam_type
        );

        if (sheetIndex !== -1) {
          // Switch to that sheet
          spreadsheet.goTo(`A1`, sheetIndex);

          // Find the next available column in row 1 of that sheet
          let colIndex = 1; // start at B (index 1 since A=0)
          while (spreadsheet.getCell(0, colIndex, sheetIndex)?.value) {
            colIndex++;
          }

          // Show ONLY topic name in row 1
          spreadsheet.updateCell(
            { value: formData.topic_name },
            { rowIndex: 0, colIndex, sheetIndex }
          );

          // Store hidden metadata in later rows
          spreadsheet.updateCell(
            { value: formData.exam_type }, // hidden exam type
            { rowIndex: 1, colIndex, sheetIndex }
          );
          spreadsheet.updateCell(
            { value: formData.total_points }, // hidden max score
            { rowIndex: 2, colIndex, sheetIndex }
          );
          spreadsheet.updateCell(
            { value: formData.subject_name }, // hidden subject name
            { rowIndex: 3, colIndex, sheetIndex }
          );
        }
      }

      setSnackbarMessage("Exam added successfully!");
      setSuccessSnackbarOpen(true);

      if (onSuccess) onSuccess();
      onClose();

      setFormData({
        subject_id: "",
        subject_name: "",
        topic_id: "",
        topic_name: "",
        exam_type: "",
        total_points: "",
      });
    } catch (err) {
      setSnackbarMessage("Failed to add exam.");
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
                  subject_name: value ? value.subject_name : "",
                  topic_id: "",
                  topic_name: "",
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

            {/* Topic Autocomplete */}
            <Autocomplete
              options={filteredTopics}
              getOptionLabel={(option) => option.topic_name || ""}
              value={
                formData.topic_id
                  ? filteredTopics.find(
                      (t) => t.topic_id === formData.topic_id
                    ) || null
                  : null
              }
              onChange={(e, value) =>
                setFormData((prev) => ({
                  ...prev,
                  topic_id: value ? value.topic_id : "",
                  topic_name: value ? value.topic_name : "",
                  subject_id: value ? value.subject_id : prev.subject_id,
                  subject_name: value
                    ? subjects.find((s) => s.subject_id === value.subject_id)
                        ?.subject_name || ""
                    : prev.subject_name,
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Topic"
                  margin="normal"
                  fullWidth
                />
              )}
            />

            {/* Exam Type Autocomplete */}
            <Autocomplete
              options={examTypes}
              value={formData.exam_type}
              onChange={(e, value) =>
                setFormData((prev) => ({
                  ...prev,
                  exam_type: value || "",
                }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Exam Type"
                  margin="normal"
                  fullWidth
                />
              )}
            />

            {/* Total Points */}
            <TextField
              fullWidth
              required
              name="total_points"
              label="Total Points"
              margin="normal"
              value={formData.total_points}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  total_points: e.target.value,
                }))
              }
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
