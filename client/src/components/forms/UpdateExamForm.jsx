// src/components/forms/UpdateExamForm.jsx
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
import api from "../../api/axios";
import useSnackbar from "../../hooks/useSnackbar";
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";

export default function UpdateExamForm({
  open,
  onClose,
  onSuccess,
  examType,
  mode,
  universityId,
}) {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [items, setItems] = useState("");

  const successSnackbar = useSnackbar();
  const errorSnackbar = useSnackbar();

  // Fetch exams filtered by mode and examType
  useEffect(() => {
    if (!open) return;

    const fetchExams = async () => {
      try {
        const params = { mode, exam_type: examType };
        if (mode === "Inhouse" && universityId)
          params.university_id = universityId;

        const res = await api.get("/subject_scores", { params });
        setExams(res.data);
      } catch (err) {
        console.error("Failed to load exams:", err);
      }
    };

    fetchExams();
  }, [open, examType, mode, universityId]);

  // When selectedExam changes, update the items field
  useEffect(() => {
    if (selectedExam) {
      setItems(selectedExam.items || "");
    } else {
      setItems("");
    }
  }, [selectedExam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) {
      errorSnackbar.show("Please select an exam to update.");
      return;
    }
    if (!items || isNaN(Number(items))) {
      errorSnackbar.show("Please enter a valid number of items.");
      return;
    }

    try {
      await api.put(`subject_scores/${selectedExam.score_id}`, {
        items: Number(items),
      });

      successSnackbar.show("Exam updated successfully!");
      onSuccess?.();
      onClose?.();
      setSelectedExam(null);
      setItems("");
    } catch (err) {
      console.error("Failed to update exam:", err);
      errorSnackbar.show("Failed to update exam.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
          Update {mode} {examType} Exam
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Autocomplete
              options={exams.filter(
                (exam) => exam.mode === mode && exam.exam_type === examType
              )}
              getOptionLabel={(option) =>
                `${option.subject_name || "Unknown"} - ${
                  option.items ?? 0
                } items`
              }
              value={selectedExam}
              onChange={(e, value) => setSelectedExam(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Exam"
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
              type="number"
              margin="normal"
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <SuccessSnackbar
        open={successSnackbar.open}
        message={successSnackbar.message}
        onClose={successSnackbar.close}
      />
      <ErrorSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        onClose={errorSnackbar.close}
      />
    </>
  );
}
