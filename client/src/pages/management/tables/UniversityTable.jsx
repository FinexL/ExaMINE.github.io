//mui imports
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  TextField,
  Autocomplete,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

//icons
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

//hooks
import { useState } from "react";
import useUniversities from "../../../hooks/useUniversities";
import useSnackbar from "../../../hooks/useSnackbar";
import useArchive from "../../../hooks/useArchive";

//custom Components
import BaseDataGrid from "../../../components/tables/management/BaseDataGrid";
import TotalCards from "../cards/TotalCard";
import UniversityForm from "../../../components/forms/UniversityForm";
import ErrorSnackbar from "../../../components/alerts/ErrorSnackbar";
import SuccessSnackbar from "../../../components/alerts/SuccessSnackbar";

export default function UniversityTable() {
  const { rows, loading, error, fetchUniversities, saveUniversity, setRows } =
    useUniversities();

  const [rowModesModel, setRowModesModel] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const errorSnackbar = useSnackbar();
  const successSnackbar = useSnackbar();

  const { archive } = useArchive(); // <-- initialize hook

  const modesOptions = ["Onsite", "Inhouse"];

  const ModesEditCell = ({ id, value, field, api }) => {
    const handleChange = (_, newValue) => {
      api.setEditCellValue({ id, field: "modes", value: newValue });
    };
    return (
      <Autocomplete
        options={modesOptions}
        value={value || ""}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} variant="standard" />}
        fullWidth
        disableClearable
      />
    );
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

  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
    const row = rows.find((r) => r.university_id === id);
    if (row?.isNew)
      setRows((prev) => prev.filter((r) => r.university_id !== id));
  };

  // Archive functionality replaces delete
  const handleArchiveClick = (id) => async () => {
    try {
      await archive("universities", [id]);
      successSnackbar.show("School archived successfully!");
      setRows((prev) => prev.filter((r) => r.university_id !== id));
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

  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleFormSuccess = () => {
    fetchUniversities();
    setOpenForm(false);
    successSnackbar.show("School added successfully!");
  };

  const processRowUpdate = async (newRow) => {
    if (!newRow.university_name?.trim()) {
      errorSnackbar.show("School name cannot be empty.");
      throw new Error("Validation error");
    }

    try {
      const { number_of_students, ...cleanRow } = newRow;
      const updated = await saveUniversity(cleanRow);
      successSnackbar.show("School saved successfully!");
      return updated;
    } catch (err) {
      console.error("Failed to save School:", err);

      if (
        err.response?.status === 400 &&
        err.response?.data?.code === "ER_DUP_ENTRY"
      ) {
        errorSnackbar.show(
          "School name already exists. Please use a different name."
        );
      } else if (err.message?.includes("Duplicate entry")) {
        errorSnackbar.show(
          "School name already exists. Please use a different name."
        );
      } else {
        errorSnackbar.show("Failed to save School.");
      }

      return newRow; // revert changes
    }
  };

  const columns = [
    {
      field: "university_name",
      headerName: "School Name",
      flex: 1,
      minWidth: 350,
      maxWidth: 400,
      editable: true,
    },
    {
      field: "modes",
      headerName: "Modes",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      editable: true,
      renderEditCell: (params) => <ModesEditCell {...params} />,
    },
    {
      field: "number_of_students",
      headerName: "No. of Students",
      flex: 1,
      minWidth: 100,
      maxWidth: 150,
      editable: false,
    },
    {
      field: "dean_name",
      headerName: "Dean Name",
      flex: 1,
      minWidth: 300,
      maxWidth: 350,
      editable: true,
    },
    {
      field: "dean_email",
      headerName: "Dean Email",
      flex: 1,
      minWidth: 300,
      maxWidth: 350,
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
                icon={<ArchiveIcon />}
                label="Archive"
                onClick={handleDeleteClick(id)}
                color="warning"
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
        toolbarButtonLabel="Add School"
        getRowId={(row) => row.university_id}
        loading={loading}
        tableName="UniversityTable"
      >
        <Box display="flex" gap={2} mb={2}>
          <TotalCards title="Total School" count={rows.length} />
          <TotalCards
            title="Onsite School"
            count={rows.filter((r) => r.modes === "Onsite").length}
          />
          <TotalCards
            title="Inhouse School"
            count={rows.filter((r) => r.modes === "Inhouse").length}
          />
        </Box>
      </BaseDataGrid>

      <UniversityForm
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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to archive this School?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
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
