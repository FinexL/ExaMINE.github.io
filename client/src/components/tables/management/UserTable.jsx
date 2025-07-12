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
import useUsers from "../../../hooks/useUsers";
import UserForm from "../../forms/UserForm";

export default function UserTable() {
  const { rows, loading, error, fetchUsers, saveUser, deleteUser, setRows } =
    useUsers();

  const [rowModesModel, setRowModesModel] = useState({});
  const [openForm, setOpenForm] = useState(false);

  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);
  const handleFormSuccess = () => {
    fetchUsers();
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

  const handleDeleteClick = (id) => () => deleteUser(id);

  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
    const row = rows.find((r) => r.user_id === id);
    if (row?.isNew) {
      setRows((prev) => prev.filter((r) => r.user_id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = await saveUser(newRow);
    return updatedRow;
  };

  const columns = [
    { field: "user_id", headerName: "ID", width: 80 },
    {
      field: "user_name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "user_role",
      headerName: "Role",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "user_status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      editable: true,
    },
    {
      field: "user_email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "user_password",
      headerName: "Password",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "add_date",
      headerName: "Date Added",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "last_login",
      headerName: "Last Login",
      flex: 1,
      minWidth: 100,
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
        <Typography variant="h5">User Table</Typography>
        <Tooltip title="Add User">
          <IconButton onClick={handleAddClick}>
            <AddIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ height: 550 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.user_id}
          loading={loading}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          editMode="row"
          processRowUpdate={processRowUpdate}
          onRowEditStop={handleRowEditStop}
        />
      </Box>

      <UserForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
