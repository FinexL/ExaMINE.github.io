import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useState } from "react";
import useUniversities from "../../../hooks/useUniversities";
import UniversityForm from "../../forms/UniversityForm";

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

  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);
  const handleFormSuccess = () => {
    fetchUniversities();
    setOpenForm(false);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () =>
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });

  const handleSaveClick = (id) => () =>
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

  const handleDeleteClick = (id) => () => deleteUniversity(id);

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

  const processRowUpdate = async (newRow) => {
    const updatedRow = await saveUniversity(newRow);
    return updatedRow;
  };

  const columns = [
    { field: "university_id", headerName: "ID", width: 90 },
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
      editable: true,
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
      getActions: ({ id }) => {
        const isEditing = rowModesModel[id]?.mode === GridRowModes.Edit;
        return isEditing
          ? [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                onClick={handleCancelClick(id)}
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={handleEditClick(id)}
              />,
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
              />,
            ];
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">University Table</Typography>
        <Tooltip title="Add University">
          <IconButton onClick={handleAddClick}>
            <AddIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ height: 550 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.university_id}
          loading={loading}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          density="compact"
          editMode="row"
          processRowUpdate={processRowUpdate}
          onRowEditStop={handleRowEditStop}
        />
      </Box>

      <UniversityForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
