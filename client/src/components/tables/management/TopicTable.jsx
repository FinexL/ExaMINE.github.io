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
import useTopics from "../../../hooks/useTopics";
import TopicForm from "../../forms/TopicForm";

export default function TopicTable() {
  const { rows, loading, error, fetchTopics, saveTopic, deleteTopic, setRows } =
    useTopics();

  const [rowModesModel, setRowModesModel] = useState({});
  const [openForm, setOpenForm] = useState(false);

  const handleAddClick = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);
  const handleFormSuccess = () => {
    fetchTopics();
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

  const handleDeleteClick = (id) => () => deleteTopic(id);

  const handleCancelClick = (id) => () => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
    const row = rows.find((r) => r.topic_id === id);
    if (row?.isNew) {
      setRows((prev) => prev.filter((r) => r.topic_id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = await saveTopic(newRow);
    return updatedRow;
  };

  const columns = [
    { field: "topic_id", headerName: "ID", width: 90 },
    {
      field: "topic_name",
      headerName: "Topic Name",
      flex: 1,
      minWidth: 400,
      editable: true,
    },
    {
      field: "subject_name",
      headerName: "Subject Name",
      flex: 2,
      minWidth: 400,
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
        <Typography variant="h5">Topic Table</Typography>
        <Tooltip title="Add Topic">
          <IconButton onClick={handleAddClick}>
            <AddIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ height: 550 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.topic_id}
          loading={loading}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          editMode="row"
          processRowUpdate={processRowUpdate}
          onRowEditStop={handleRowEditStop}
        />
      </Box>

      <TopicForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
}
