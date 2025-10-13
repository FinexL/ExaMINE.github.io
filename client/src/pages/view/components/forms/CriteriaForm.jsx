import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import useGradeCriteria from "../../../../hooks/useGradeCriteria";

export default function CriteriaForm({ open, onClose, onSave, mode }) {
  const { criteria, updateCriteria, loading, error } = useGradeCriteria(mode);
  const [thresholds, setThresholds] = useState(criteria);

  useEffect(() => {
    setThresholds(criteria); // sync when criteria changes
  }, [criteria]);

  const handleChange = (field) => (e) => {
    setThresholds((prev) => ({ ...prev, [field]: Number(e.target.value) }));
  };

  const handleSave = async () => {
    const success = await updateCriteria(thresholds);
    if (success) {
      onSave(thresholds);
      onClose();
    }
  };

  if (loading)
    return (
      <Dialog open={open}>
        <DialogContent>Loading...</DialogContent>
      </Dialog>
    );
  if (error)
    return (
      <Dialog open={open}>
        <DialogContent>Error: {error}</DialogContent>
      </Dialog>
    );

  const textFieldWidth = 150;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Result Criteria Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {["red", "yellow", "green", "white"].map((color, i) => {
            const min =
              i === 0 ? 0 : thresholds[["red", "yellow", "green"][i - 1]] + 1;
            const max = thresholds[color];

            return (
              <Box key={color} display="flex" gap={2} alignItems="center">
                <TextField
                  label={`${
                    color.charAt(0).toUpperCase() + color.slice(1)
                  } Min`}
                  value={min}
                  disabled
                  sx={{ width: 80 }}
                />
                <TextField
                  label={`${
                    color.charAt(0).toUpperCase() + color.slice(1)
                  } Max`}
                  value={max}
                  onChange={(e) =>
                    setThresholds((prev) => ({
                      ...prev,
                      [color]: Number(e.target.value),
                    }))
                  }
                  sx={{ width: 80 }}
                />
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
