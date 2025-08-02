//mui imports
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
//custom components
import TotalCards from "../../cards/TotalCard";

import StudentForm from "../../forms/StudentForm";

import ErrorSnackbar from "../../alerts/ErrorSnackbar";
import SuccessSnackbar from "../../alerts/SuccessSnackbar";
import BaseDataGrid from "../BaseDataGrid";
//icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
//hooks
import { useState } from "react";
import useStudents from "../../../hooks/useStudents";
import useUniversities from "../../../hooks/useUniversities";

export default function StudentTable() {
  const {
    rows,
    loading,
    error,
    fetchStudents,
    saveStudent,
    deleteStudent,
    setRows,
  } = useStudents();

  const { rows: universities } = useUniversities();
  const [rowModesModel, setRowModesModel] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const suffixOptions = ["", "Jr.", "Sr.", "II", "III", "IV", "V"];

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
    setSuccessMessage("Saved successfully!");
    setSuccessOpen(true);
  };

  const handleDeleteClick = (id) => () => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.student_id === id);
    if (editedRow?.isNew) {
      setRows((prev) => prev.filter((row) => row.student_id !== id));
    }
  };

  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleFormSuccess = (newRow) => {
    fetchStudents();
    setOpenForm(false);
    setSuccessMessage("Student added successfully!");
    setSuccessOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        await deleteStudent(selectedId);
        setSuccessMessage("Student deleted successfully.");
        setSuccessOpen(true);
        fetchStudents();
      } catch (err) {
        setSnackbarMessage("Failed to delete student.");
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
    const { first_name, last_name, suffix, university_name } = newRow;

    if (!first_name?.trim() || !last_name?.trim()) {
      setSnackbarMessage("First name and Last name is required.");
      setSnackbarOpen(true);
      throw new Error("Validation error");
    }

    if (suffix && !suffixOptions.includes(suffix)) {
      setSnackbarMessage("Please select a valid suffix.");
      setSnackbarOpen(true);
      throw new Error("Invalid suffix");
    }

    const university = universities.find(
      (u) => u.university_name === university_name
    );
    if (!university) {
      setSnackbarMessage("Please select a valid university.");
      setSnackbarOpen(true);
      throw new Error("Invalid university");
    }

    try {
      const updated = await saveStudent({
        ...newRow,
        university_id: university.university_id,
      });

      return {
        ...updated,
        university_name: university.university_name,
      };
    } catch (err) {
      console.error("Failed to save student:", err);
      setSnackbarMessage("Failed to save student.");
      setSnackbarOpen(true);
      return newRow;
    }
  };

  const UniversityEditCell = ({ id, value, field, api }) => {
    const options = universities.map((u) => u.university_name);

    const handleChange = (_, newValue) => {
      if (options.includes(newValue)) {
        api.setEditCellValue({
          id,
          field: "university_name",
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

  const SuffixEditCell = ({ id, value, field, api }) => {
    const handleChange = (_, newValue) => {
      api.setEditCellValue({
        id,
        field: "suffix",
        value: newValue,
      });
    };

    return (
      <Autocomplete
        options={suffixOptions}
        value={value ?? ""}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} variant="standard" />}
        fullWidth
        disableClearable
        freeSolo={false}
        getOptionLabel={(option) => (option === "" ? "None" : option)}
      />
    );
  };

  const columns = [
    {
      field: "student_id",
      headerName: "ID",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
      minWidth: 120,
      editable: true,
    },
    {
      field: "middle_name",
      headerName: "Middle Name",
      flex: 1,
      minWidth: 120,
      editable: true,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
      minWidth: 120,
      editable: true,
    },
    {
      field: "suffix",
      headerName: "Suffix",
      flex: 1,
      minWidth: 100,
      editable: true,
      renderEditCell: (params) => <SuffixEditCell {...params} />,
    },
    {
      field: "university_name",
      headerName: "University",
      minWidth: 250,
      flex: 1,
      editable: true,
      renderEditCell: (params) => <UniversityEditCell {...params} />,
    },
    {
      field: "add_date",
      headerName: "Date Added",
      minWidth: 100,
      flex: 1,
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
        toolbarButtonLabel="Add Student"
        tableName="StudentTable"
        loading={loading}
        getRowId={(row) => row.student_id}
      >
        <TotalCards title="Total Students" count={rows.length} />
      </BaseDataGrid>

      <StudentForm
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
