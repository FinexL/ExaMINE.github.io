//mui imports
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import {
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

//custom components
import TotalCards from "../cards/TotalCard";
import ErrorSnackbar from "../../../components/alerts/ErrorSnackbar";
import SuccessSnackbar from "../../../components/alerts/SuccessSnackbar";
import SubjectForm from "../../../components/forms/SubjectForm";
import BaseDataGrid from "../../../components/tables/management/BaseDataGrid";

//icons
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

//hooks
import { useState } from "react";
import useSubjects from "../../../hooks/useSubjects";
import useSnackbar from "../../../hooks/useSnackbar";
import useArchive from "../../../hooks/useArchive";

export default function SubjectTable() {
  const { rows, loading, error, fetchSubjects, saveSubject, setRows } =
    useSubjects();

  const rowModesModelDefault = {};
  const [rowModesModel, setRowModesModel] = useState(rowModesModelDefault);
  const [openForm, setOpenForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { archive } = useArchive();

  const successSnackbar = useSnackbar();
  const errorSnackbar = useSnackbar();

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

    const editedRow = rows.find((r) => r.subject_id === id);
    if (editedRow?.isNew) {
      setRows((prev) => prev.filter((r) => r.subject_id !== id));
    }
  };

  // --- Archive ---
  const handleArchiveClick = (id) => () => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (selectedId !== null) {
      try {
        await archive("subjects", [selectedId]);
        successSnackbar.show("Subject archived successfully!");
        fetchSubjects();
      } catch (err) {
        console.error(err);
        const message =
          err.response?.data?.error || "Failed to archive subject.";
        errorSnackbar.show(message);
      } finally {
        setConfirmOpen(false);
        setSelectedId(null);
      }
    }
  };

  const handleCancelArchive = () => {
    setSelectedId(null);
    setConfirmOpen(false);
  };

  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const handleFormSuccess = () => {
    fetchSubjects();
    setOpenForm(false);
    successSnackbar.show("Subject added successfully!");
  };

  const processRowUpdate = async (newRow) => {
    if (!newRow.subject_name?.trim()) {
      errorSnackbar.show("Subject Name is required.");
      throw new Error("Validation error");
    }

    try {
      const updated = await saveSubject(newRow);
      successSnackbar.show("Subject updated successfully!");
      return updated;
    } catch (err) {
      console.error("Failed to save subject:", err);
      errorSnackbar.show("Failed to save subject.");
      return newRow;
    }
  };

  const columns = [
    {
      field: "subject_name",
      headerName: "Subject Name",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
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
                icon={<ArchiveIcon />}
                label="Archive"
                onClick={handleArchiveClick(id)}
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
        toolbarButtonLabel="Add Subject"
        tableName="SubjectTable"
        loading={loading}
        getRowId={(row) => row.subject_id}
      >
        <TotalCards title="Total Subjects" count={rows.length} />
      </BaseDataGrid>

      <SubjectForm
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
          Are you sure you want to archive this subject?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelArchive} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmArchive}
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
