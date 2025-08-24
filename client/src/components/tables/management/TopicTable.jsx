//mui imports
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
//custom components

import TotalCards from "../../cards/TotalCard";

import ErrorSnackbar from "../../alerts/ErrorSnackbar";
import SuccessSnackbar from "../../alerts/SuccessSnackbar";
import TopicForm from "../../forms/TopicForm";
import BaseDataGrid from "../BaseDataGrid";
//icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
//hooks
import { useState } from "react";
import useTopics from "../../../hooks/useTopics";
import useSubjects from "../../../hooks/useSubjects";

export default function TopicTable() {
  const { rows, loading, error, fetchTopics, saveTopic, deleteTopic, setRows } =
    useTopics();

  const { rows: subjects } = useSubjects();
  const [rowModesModel, setRowModesModel] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));

    const editedRow = rows.find((r) => r.topic_id === id); // or university_id
    if (editedRow?.isNew) {
      setRows((prev) => prev.filter((r) => r.topic_id !== id)); // or university_id
    }
  };

  const handleAddClick = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleFormSuccess = (newRow) => {
    fetchTopics();
    setOpenForm(false);
    setSuccessMessage("Topic added successfully!");
    setSuccessOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        await deleteTopic(selectedId);
        setSuccessMessage("Topic deleted successfully!");
        setSuccessOpen(true);
      } catch (error) {
        setSnackbarMessage("Failed to delete topic.");
        setSnackbarOpen(true);
      } finally {
        setConfirmOpen(false);
        setSelectedId(null);
      }
    }
  };
  const handleCancelDelete = () => {
    setSelectedId(null);
    setConfirmOpen(false);
  };

  const processRowUpdate = async (newRow) => {
    const { topic_name, subject_name } = newRow;

    if (!subject_name || !subject_name.trim()) {
      setSnackbarMessage("Subject is required.");
      setSnackbarOpen(true);
      throw new Error("Validation error");
    }
    if (!topic_name || !topic_name.trim()) {
      setSnackbarMessage("Topic is required.");
      setSnackbarOpen(true);
      throw new Error("Validation error");
    }

    const subject = subjects.find((s) => s.subject_name === subject_name);
    if (!subject) {
      setSnackbarMessage("Please select a valid subject.");
      setSnackbarOpen(true);
      throw new Error("Invalid subject");
    }

    try {
      const updated = await saveTopic({
        ...newRow,
        subject_id: subject.subject_id,
      });

      setSuccessMessage("Topic updated successfully!");
      setSuccessOpen(true);

      return { ...updated, subject_name: subject.subject_name };
    } catch (err) {
      console.error("Failed to save topic:", err);
      setSnackbarMessage("Failed to save topic.");
      setSnackbarOpen(true);
      return newRow;
    }
  };

  const SubjectEditCell = ({ id, value, field, api }) => {
    const options = subjects.map((s) => s.subject_name);

    const handleChange = (_, newValue) => {
      if (options.includes(newValue)) {
        api.setEditCellValue({
          id,
          field: "subject_name",
          value: newValue,
        });
      }
    };

    return (
      <Autocomplete
        options={options}
        value={value || ""}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} variant="standard" />}
        fullWidth
        disableClearable
        freeSolo={false}
      />
    );
  };

  const columns = [
    {
      field: "topic_name",
      headerName: "Topic Name",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "subject_name",
      headerName: "Subject Name",
      flex: 1,
      minWidth: 200,
      editable: true,
      renderEditCell: (params) => <SubjectEditCell {...params} />,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isInEditMode
          ? [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
                color="primary"
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="error"
              />,
            ];
      },
    },
  ];
  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  return (
    <Box>
      <BaseDataGrid
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        setRowModesModel={setRowModesModel}
        processRowUpdate={processRowUpdate}
        onRowEditStop={handleRowEditStop}
        onAddClick={handleAddClick}
        toolbarButtonLabel="Add Topic"
        tableName="TopicTable"
        loading={loading}
        getRowId={(row) => row.topic_id}
      >
        <TotalCards title="Total Topics" count={rows.length} />
      </BaseDataGrid>

      <TopicForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
      <ErrorSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      <SuccessSnackbar
        open={successOpen}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Are you sure you want to delete this topic?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
