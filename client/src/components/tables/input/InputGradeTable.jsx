import { Box, Typography, Tooltip, IconButton } from "@mui/material";
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
import useStudents from "../../../hooks/useStudents";
import StudentForm from "../../forms/StudentForm";

export default function InputGradeTable() {
  const {
    rows,
    loading,
    error,
    fetchStudents,
    saveStudent,
    deleteStudent,
    setRows,
  } = useStudents();

  const [rowModesModel, setRowModesModel] = useState({});
  const [openForm, setOpenForm] = useState(false);

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
    deleteStudent(id);
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

  const handleAddClick = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleFormSuccess = () => {
    fetchStudents();
    setOpenForm(false);
  };

  const processRowUpdate = async (newRow) => {
    try {
      const updatedRow = await saveStudent(newRow);
      return updatedRow;
    } catch (err) {
      console.error("Process row update failed:", err);
      return newRow;
    }
  };

  const columns = [
    { field: "student_id", headerName: "ID", flex: 1, minWidth: 80 },
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
    },
    {
      field: "university_name",
      headerName: "University name",
      minWidth: 350,
      flex: 1,
      editable: true,
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
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
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
          ];
        }

        return [
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
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Student Table</Typography>
        <Tooltip title="Add Student">
          <IconButton onClick={handleAddClick}>
            <AddIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ height: 550 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.student_id}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          density="compact"
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          onRowEditStop={handleRowEditStop}
        />
      </Box>

      <StudentForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
