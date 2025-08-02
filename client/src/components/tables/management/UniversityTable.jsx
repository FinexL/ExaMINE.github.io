//mui imports
import { Box, Typography } from "@mui/material";
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
//custom components
import BaseDataGrid from "../BaseDataGrid";
import TotalCards from "../../cards/TotalCard";
import UniversityForm from "../../forms/UniversityForm";

import ErrorSnackbar from "../../alerts/ErrorSnackbar";
import SuccessSnackbar from "../../alerts/SuccessSnackbar";

//icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
//hooks
import { useState } from "react";
import useUniversities from "../../../hooks/useUniversities";

export default function UniversityTable() {
  const {
    rows,
    loading,
    error,
    fetchUniversities,
    saveUniversity,
    deleteUniversity,
    setRows,
  } = useUniversities();

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

  const handleEditClick = (id) => () =>
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    setSuccessMessage("Saved successfully!");
    setSuccessOpen(true);
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
    const row = rows.find((r) => r.university_id === id);
    if (row?.isNew) {
      setRows((prev) => prev.filter((r) => r.university_id !== id));
    }
  };

  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleFormSuccess = () => {
    fetchUniversities();
    setOpenForm(false);
    setSuccessMessage("University added successfully!");
    setSuccessOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        await deleteUniversity(selectedId);
        setSuccessMessage("University deleted successfully.");
        setSuccessOpen(true);
        fetchUniversities();
      } catch (err) {
        setSnackbarMessage("Failed to delete university.");
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
    const { university_name } = newRow;

    if (!university_name?.trim()) {
      setSnackbarMessage("University name cannot be empty.");
      setSnackbarOpen(true);
      throw new Error("Validation error");
    }

    try {
      const { number_of_students, ...cleanRow } = newRow;
      const updatedRow = await saveUniversity(cleanRow);
      return updatedRow;
    } catch (err) {
      console.error("Failed to save university:", err);
      setSnackbarMessage("Failed to save university.");
      setSnackbarOpen(true);
      return newRow;
    }
  };

  const columns = [
    {
      field: "university_name",
      headerName: "Name",
      flex: 1,
      minWidth: 350,
      editable: true,
    },
    {
      field: "number_of_students",
      headerName: "No. of Students",
      flex: 1,
      minWidth: 150,
      editable: false,
    },
    {
      field: "dean_name",
      headerName: "Dean Name",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "dean_email",
      headerName: "Dean Email",
      flex: 1,
      minWidth: 250,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => {
        const isEditing = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isEditing
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
                color="inherit"
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
        toolbarButtonLabel="Add University"
        tableName="UniversityTable"
        loading={loading}
        getRowId={(row) => row.university_id}
      >
        <TotalCards title="Total Universities" count={rows.length} />
      </BaseDataGrid>

      <UniversityForm
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
    </Box>
  );
}
