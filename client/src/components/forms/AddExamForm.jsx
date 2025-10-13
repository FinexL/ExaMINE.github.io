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
import useSnackbar from "../../hooks/useSnackbar";
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";
import api from "../../api/axios";

export default function AddExamForm({
  open,
  onClose,
  onSuccess,
  examType,
  mode,
  universityId,
}) {
  const [formData, setFormData] = useState({
    subject_id: "",
    items: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [restoreDialog, setRestoreDialog] = useState({
    open: false,
    payload: null,
    message: "",
  });

  const successSnackbar = useSnackbar();
  const errorSnackbar = useSnackbar();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
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
      errorSnackbar.show("Please select a subject.");
      return;
    }
    if (!formData.items || isNaN(Number(formData.items))) {
      errorSnackbar.show("Please enter a valid number of items.");
      return;
    }

    const payload = {
      ...formData,
      exam_type: examType,
      mode,
      exam_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    if (universityId) {
      payload.university_id = universityId;
    }

    try {
      await api.post("subject_scores", payload, { withCredentials: true });

      successSnackbar.show("Exam added successfully!");
      onSuccess?.();
      onClose?.();
      setFormData({ subject_id: "", items: "" });
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.archived) {
        // backend can send { archived: true } to indicate archive exists
        setRestoreDialog({
          open: true,
          payload,
          message: `This exam already exists but is archived. Restore it?`,
        });
      } else {
        errorSnackbar.show("Exam already exists inside " + examType);
      }
      console.error("Exam creation failed:", err);
    }
  };

  const handleRestore = async () => {
    if (!restoreDialog.payload) return;

    try {
      await api.post("subject_scores", restoreDialog.payload, {
        params: { restore: true }, // optional query param if backend expects it
        withCredentials: true,
      });
      successSnackbar.show("Exam restored successfully!");
      onSuccess?.();
      onClose?.();
      setFormData({ subject_id: "", items: "" });
    } catch (err) {
      errorSnackbar.show("Failed to restore exam.");
      console.error("Restore failed:", err);
    } finally {
      setRestoreDialog({ open: false, payload: null, message: "" });
    }
  };

  const handleCancelRestore = () => {
    setRestoreDialog({ open: false, payload: null, message: "" });
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

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialog.open} onClose={handleCancelRestore}>
        <DialogTitle>Restore Exam?</DialogTitle>
        <DialogContent>{restoreDialog.message}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRestore} color="secondary">
            No
          </Button>
          <Button onClick={handleRestore} color="primary" variant="contained">
            Yes
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
