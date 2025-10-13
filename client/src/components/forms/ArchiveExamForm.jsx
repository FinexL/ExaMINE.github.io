import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
} from "@mui/material";
import useSnackbar from "../../hooks/useSnackbar";
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";
import useArchive from "../../hooks/useArchive";
import api from "../../api/axios";

export default function ArchiveExamForm({
  open,
  onClose,
  onSuccess,
  examType,
  mode,
  universityId,
}) {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const successSnackbar = useSnackbar();
  const errorSnackbar = useSnackbar();
  const { archive } = useArchive();

  useEffect(() => {
    const fetchExams = async () => {
      if (!open) return;

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

  // Step 1: open confirmation dialog
  const handleArchive = () => {
    if (!selectedExam) {
      errorSnackbar.show("Please select an exam to archive.");
      return;
    }
    setConfirmOpen(true);
  };

  // Step 2: cancel archive
  const handleCancelArchive = () => {
    setConfirmOpen(false);
  };

  // Step 3: confirm archive
  const handleConfirmArchive = async () => {
    try {
      await archive("subject_scores", [selectedExam.score_id]); // ✅ use archive hook
      successSnackbar.show("Exam archived successfully!");
      onSuccess?.();
      onClose?.();
      setSelectedExam(null);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Failed to archive exam:", err);
      errorSnackbar.show("Failed to archive exam.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>
          Archive {mode} {examType} Exam
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleArchive} variant="contained" color="warning">
            Archive
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancelArchive}>
        <DialogTitle>
          Are you sure you want to archive{" "}
          <strong>{selectedExam?.subject_name}</strong> inside{" "}
          <strong>{examType}</strong>?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelArchive} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmArchive}
            color="warning"
            variant="contained"
          >
            Archive
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
