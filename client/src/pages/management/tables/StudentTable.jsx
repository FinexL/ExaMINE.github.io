//mui imports
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
//custom components
import TotalCards from "../cards/TotalCard";
import StudentForm from "../../../components/forms/StudentForm";
import ErrorSnackbar from "../../../components/alerts/ErrorSnackbar";
import SuccessSnackbar from "../../../components/alerts/SuccessSnackbar";
import BaseDataGrid from "../../../components/tables/management/BaseDataGrid";
//icons
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
//hooks
import { useState } from "react";
import useStudents from "../../../hooks/useStudents";
import useUniversities from "../../../hooks/useUniversities";
import useSnackbar from "../../../hooks/useSnackbar";
import useArchive from "../../../hooks/useArchive";

import { getAllowedModes } from "../../../utils/getAllowedModes";

export default function StudentTable() {
  const { rows, loading, error, fetchStudents, saveStudent, setRows } =
    useStudents();
  const { rows: universities } = useUniversities();
  const { archive } = useArchive();

  const [rowModesModel, setRowModesModel] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rowUniversityModes, setRowUniversityModes] = useState({});
  const suffixOptions = ["", "Jr.", "Sr.", "II", "III", "IV", "V"];

  // --- Snackbar hooks ---
  const errorSnackbar = useSnackbar();
  const successSnackbar = useSnackbar();

  // --- Form handlers ---
  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);
  const handleFormSuccess = () => {
    fetchStudents();
    setOpenForm(false);
    successSnackbar.show("Student added successfully!");
  };

  // --- Archive handlers ---
  const handleArchiveClick = (id) => async () => {
    try {
      await archive("students", [id]);
      successSnackbar.show("Student archived successfully!");
      setRows((prev) => prev.filter((r) => r.student_id !== id));
    } catch (err) {
      errorSnackbar.show(err.response?.data?.error || err.message);
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const handleDeleteClick = (id) => () => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleCancelArchive = () => {
    setSelectedId(null);
    setConfirmOpen(false);
  };

  // --- Row editing ---
  const handleEditClick = (id) => () =>
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

  const handleSaveClick = (id) => () =>
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

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

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // --- Process row updates ---
  const processRowUpdate = async (newRow) => {
    const { first_name, last_name, suffix, modes, university_name } = newRow;

    if (!first_name?.trim() || !last_name?.trim()) {
      errorSnackbar.show("First name and Last name are required.");
      throw new Error("Validation error");
    }

    if (!modes?.trim()) {
      errorSnackbar.show("Mode is required.");
      throw new Error("Validation error");
    }

    if (suffix && !suffixOptions.includes(suffix)) {
      errorSnackbar.show("Please select a valid suffix.");
      throw new Error("Invalid suffix");
    }

    const university = universities.find(
      (u) => u.university_name === university_name
    );
    if (!university) {
      errorSnackbar.show("Please select a valid university.");
      throw new Error("Invalid university");
    }

    try {
      const updated = await saveStudent({
        ...newRow,
        university_id: university.university_id,
        modes,
      });
      successSnackbar.show("Saved successfully!");
      return { ...updated, university_name: university.university_name };
    } catch (err) {
      console.error("Failed to save student:", err);
      errorSnackbar.show("Failed to save student.");
      return newRow;
    }
  };

  // --- Editable cells ---
  const UniversityEditCell = ({ id, value, field, api }) => {
    const options = universities.map((u) => u.university_name);

    const handleChange = (_, newValue) => {
      const uni = universities.find((u) => u.university_name === newValue);

      setRowUniversityModes((prev) => ({
        ...prev,
        [id]: uni?.modes || "",
      }));

      const currentMode = api.getRow(id)?.modes;
      const validModes = uni?.modes ? [uni.modes] : [];

      if (!validModes.includes(currentMode)) {
        api.setEditCellValue({ id, field: "modes", value: "" });
      }

      api.setEditCellValue({ id, field: "university_name", value: newValue });
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

  const ModesEditCell = ({ id, value, field, api }) => {
    const universityMode = rowUniversityModes[id] || "";
    const options = universityMode ? [universityMode] : [];

    const handleChange = (_, newValue) =>
      api.setEditCellValue({ id, field, value: newValue });

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
    const handleChange = (_, newValue) =>
      api.setEditCellValue({ id, field: "suffix", value: newValue });
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

  // --- Columns ---
  const columns = [
    {
      field: "student_id",
      headerName: "ID",
      flex: 1,
      minWidth: 50,
      maxWidth: 80,
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
      minWidth: 80,
      editable: true,
      renderEditCell: (params) => <SuffixEditCell {...params} />,
    },
    {
      field: "modes",
      headerName: "Mode",
      width: 120,
      editable: true,
      renderEditCell: (params) => {
        const allowedModes = getAllowedModes(
          params.row.university_id,
          universities
        );

        return (
          <Select
            value={params.value || ""}
            onChange={(e) =>
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              })
            }
            fullWidth
          >
            {allowedModes.map((mode) => (
              <MenuItem key={mode} value={mode}>
                {mode}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "university_name",
      headerName: "School",
      minWidth: 250,
      flex: 1,
      editable: true,
      renderEditCell: (params) => <UniversityEditCell {...params} />,
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
                icon={<ArchiveIcon />}
                label="Archive"
                onClick={handleDeleteClick(id)}
                color="warning"
              />,
            ];
      },
    },
  ];

  if (error)
    return (
      <Box sx={{ width: "100%" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

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
        getRowId={(row) => row.student_id}
        loading={loading}
        tableName="StudentTable"
      >
        <Box display="flex" gap={2} mb={2}>
          <TotalCards title="Total Students" count={rows.length} />
          <TotalCards
            title="Onsite Students"
            count={rows.filter((r) => r.modes === "Onsite").length}
          />
          <TotalCards
            title="Inhouse Students"
            count={rows.filter((r) => r.modes === "Inhouse").length}
          />
        </Box>
      </BaseDataGrid>

      <StudentForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />

      <ErrorSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        onClose={errorSnackbar.close}
      />
      <SuccessSnackbar
        open={successSnackbar.open}
        message={successSnackbar.message}
        onClose={successSnackbar.close}
      />

      <Dialog open={confirmOpen} onClose={handleCancelArchive}>
        <DialogTitle>
          Are you sure you want to archive this student?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelArchive} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleArchiveClick(selectedId)}
            color="warning"
            variant="contained"
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
