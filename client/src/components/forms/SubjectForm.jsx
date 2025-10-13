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
import api from "../../api/axios";
import useSnackbar from "../../hooks/useSnackbar";
import SuccessSnackbar from "../alerts/SuccessSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";

export default function SubjectForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    subject_name: "",
  });
  const [restoreDialog, setRestoreDialog] = useState({
    open: false,
    message: "",
    subject_id: null,
  });

  const successSnackbar = useSnackbar();
  const errorSnackbar = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject_name.trim()) {
      errorSnackbar.show("Subject name is required.");
      return;
    }
    try {
      await api.post("/subjects", formData, { withCredentials: true });
      successSnackbar.show("Subject added successfully!");
      onSuccess?.();
      onClose?.();
      setFormData({ subject_name: "" });
    } catch (err) {
      const data = err.response?.data;

      if (data?.error === "DUPLICATE") {
        errorSnackbar.show(
          "Subject name already exists. Please use a different name."
        );
      } else if (data?.error === "ARCHIVED_EXISTS") {
        // Show restore dialog
        setRestoreDialog({
          open: true,
          message: data.message,
          subject_id: data.subject_id,
        });
      } else {
        errorSnackbar.show("Failed to create subject.");
      }

      console.error("Subject creation failed:", err);
    }
  };
  const handleCancelRestore = () => {
    setRestoreDialog({ open: false, message: "", subject_id: null });
  };

  const handleRestore = async () => {
    try {
      await api.patch(`/subjects/${restoreDialog.subject_id}/restore`, null, {
        withCredentials: true,
      });
      successSnackbar.show("Subject restored successfully!");
      onSuccess?.();
      handleCancelRestore();
      onClose?.();
      setFormData({ subject_name: "" });
    } catch (err) {
      errorSnackbar.show("Failed to restore subject.");
      console.error("Restore failed:", err);
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={restoreDialog.open} onClose={handleCancelRestore}>
        <DialogTitle>Restore Subject?</DialogTitle>
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
