//This change design of the table
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CustomToolbar from "../buttons/CustomToolbar";
import ExportButtons from "../buttons/ExportButton";

export default function BaseDataGrid({
  rows,
  columns,
  loading,
  rowModesModel,
  setRowModesModel,
  processRowUpdate,
  onRowEditStop,
  getRowId,
  onAddClick,
  toolbarButtonLabel = "Add",
  tableName = "Table",
  children,
}) {
  return (
    <Box sx={{ width: "100%" }}>
      {children}

      <Box sx={{ height: 550 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          onRowEditStop={onRowEditStop}
          disableColumnMenu
          editMode="row"
          density="compact"
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontWeight: "bold",
              borderBottom: "2px solid #1565c0",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "black",
              lineHeight: "1.4",
              whiteSpace: "normal",
            },
          }}
          slots={{
            toolbar: () => (
              <CustomToolbar
                onAddClick={onAddClick}
                addLabel={toolbarButtonLabel}
                exportButton={<ExportButtons tableName={tableName} />}
              />
            ),
          }}
          showToolbar
        />
      </Box>
    </Box>
  );
}
