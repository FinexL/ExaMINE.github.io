import { Box, Button } from "@mui/material";

export default function InputGradeToolbar({
  onAddClick,
  onSaveClick,
  saveDisabled = true,
  addLabel = "Add Exam",
  saveLabel = "Save",
}) {
  return (
    <Box display="flex" gap={2} mb={1}>
      <Button variant="contained" onClick={onAddClick}>
        {addLabel}
      </Button>
      <Button variant="contained" onClick={onSaveClick} disabled={saveDisabled}>
        {saveLabel}
      </Button>
    </Box>
  );
}
