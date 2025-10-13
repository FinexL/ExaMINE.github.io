import { useState } from "react";
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
import api from "../../api/axios";
import useSnackbar from "../../hooks/useSnackbar";
import ErrorSnackbar from "../alerts/ErrorSnackbar";
import SuccessSnackbar from "../alerts/SuccessSnackbar";

export default function UniversityForm({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    university_name: "",
    dean_name: "",
    dean_email: "",
    modes: "",
  });

  const [restoreDialog, setRestoreDialog] = useState({
    open: false,
    message: "",
    university_id: null,
  });

  const successSnackbar = useSnackbar();
  const errorSnackbar = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.university_name.trim()) missingFields.push("School name");
    if (!formData.modes) missingFields.push("Modes");

    if (missingFields.length > 0) {
      const message =
        missingFields.length === 1
          ? `${missingFields[0]} is required`
          : `${missingFields.slice(0, -1).join(", ")} and ${
              missingFields[missingFields.length - 1]
            } are required`;
      errorSnackbar.show(message);
      return;
    }

    try {
      await api.post("/universities", formData, {
        withCredentials: true,
      });
      successSnackbar.show("School created successfully!");
      onSuccess?.();
      onClose?.();
      setFormData({
        university_name: "",
        dean_name: "",
        dean_email: "",
        modes: "",
      });
    } catch (err) {
      const error = err.response?.data?.error;

      if (error === "DUPLICATE") {
        errorSnackbar.show(
          "School name already exists. Please use a different name."
        );
      } else if (error === "ARCHIVED_EXISTS") {
        // open restore confirmation dialog
        setRestoreDialog({
          open: true,
          message: err.response?.data?.message,
          university_id: err.response?.data?.university_id,
        });
      } else {
        errorSnackbar.show("Failed to create school.");
      }
      console.error("School creation failed:", err);
    }
  };

  const handleRestore = async () => {
    try {
      await api.post(`/universities/${restoreDialog.university_id}/restore`);
      successSnackbar.show("School restored successfully!");
      onSuccess?.();
      onClose?.();
    } catch (restoreErr) {
      errorSnackbar.show("Failed to restore school.");
    } finally {
      setRestoreDialog({ open: false, message: "", university_id: null });
    }
  };

  const handleCancelRestore = () => {
    setRestoreDialog({ open: false, message: "", university_id: null });
  };

  return (
    <>
      {/* Create / Edit Form */}
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add School</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              required
              name="university_name"
              label="School Name"
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

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialog.open} onClose={handleCancelRestore}>
        <DialogTitle>Restore School?</DialogTitle>
        <DialogContent>{restoreDialog.message}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRestore} color="primary">
            No
          </Button>
          <Button onClick={handleRestore} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
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
