import { Box, Button, Menu, MenuItem } from "@mui/material";
import SaveButton from "../../../buttons/SaveButton";
import SearchBar from "../../../searchbar/searchbar";

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function InputGradeToolbar({
  onAddClick,
  onSaveClick,
  onEditClick,
  onArchiveClick,
  saveDisabled = true,
  saveLabel = "Save Changes",
  quickFilter,
  setQuickFilter,
  headerSearch,
  setHeaderSearch,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      mb={1}
      flexWrap="wrap"
    >
      {/* Left side: search bars */}
      <Box display="flex" gap={1}>
        <SearchBar
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          placeholder="Search all rows..."
        />
        <SearchBar
          value={headerSearch}
          onChange={(e) => setHeaderSearch(e.target.value)}
          placeholder="Search headers..."
        />
      </Box>

      {/* Right side: toolbar buttons */}
      <Box display="flex" alignItems="center" gap={1}>
        <SaveButton onClick={onSaveClick} disabled={saveDisabled}>
          {saveLabel}
        </SaveButton>

        <Button
          sx={{
            textTransform: "none",
            boxShadow: "none",
            borderRadius: 5,
            fontSize: "0.8rem",
            maxWidth: 100,
            minWidth: 64,
            padding: "8px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          variant="contained"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              onAddClick();
              handleClose();
            }}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            Add Exam
          </MenuItem>
          <MenuItem
            onClick={() => {
              onEditClick();
              handleClose();
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Exam
          </MenuItem>
          <MenuItem
            onClick={() => {
              onArchiveClick();
              handleClose();
            }}
          >
            <ArchiveIcon fontSize="small" sx={{ mr: 1 }} />
            Archive Exam
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
