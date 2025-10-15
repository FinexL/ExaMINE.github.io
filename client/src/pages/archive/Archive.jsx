import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

import useArchive from "../../hooks/useArchive";

import ErrorSnackbar from "../../components/alerts/ErrorSnackbar";
import SuccessSnackbar from "../../components/alerts/SuccessSnackbar";
import useUsers from "../../hooks/useUsers";

export default function Archive() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rowToUnarchive, setRowToUnarchive] = useState(null);

  const { profile } = useUsers();
  const archiveApi = useArchive();
  const { loading } = archiveApi;

  const tables = [
    "students",
    "subjects",
    "users",
    "universities",

    "subject_scores",
  ];

  // Normalize row helper
  const normalizeRow = (table, item) => {
    let title = "";
    switch (table) {
      case "students":
        title = `${item.last_name}, ${item.first_name} ${
          item.middle_name ?? ""
        } ${item.suffix ?? ""} | ${item.university_name ?? ""}`.trim();
        break;
      case "subjects":
        title = item.subject_name;
        break;
      case "universities":
        title = `${item.university_name} | ${item.modes ?? ""}`.trim();
        break;
      case "subject_scores":
        title = `${item.subject_name ?? ""} | ${item.items} | ${
          item.university_name ?? ""
        } | ${item.mode ?? ""} | ${item.exam_type ?? ""}`.trim();

        break;
      case "users":
        title = item.user_name ?? `${item.first_name} ${item.last_name}`;
        break;

      default:
        title = "Unknown";
    }

    return {
      ...item,
      id: `${table}-${
        item.student_id ??
        item.subject_id ??
        item.user_id ??
        item.university_id ??
        item.score_id
      }`,

      type: table,
      title,
      // Use profile.username if available, fallback to archived_by
      owner: item.archived_by_name ?? "Unknown",

      archivedAt: item.archived_at
        ? new Date(item.archived_at).toLocaleString()
        : "Unknown",
    };
  };

  // Fetch archived data
  useEffect(() => {
    const fetchArchivedData = async () => {
      try {
        let allRows = [];
        for (const table of tables) {
          const data = await archiveApi.fetchArchived(table);
          allRows = allRows.concat(
            data.map((item) => normalizeRow(table, item))
          );
        }
        setRows(allRows);
      } catch (err) {
        setSnackbar({
          open: true,
          message: `Failed to fetch archived data: ${err.message}`,
          severity: "error",
        });
      }
    };

    fetchArchivedData();
  }, []);

  // Filtering
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (!q) return true;
      return r.title?.toLowerCase().includes(q) ?? false;
    });
  }, [rows, search, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const displayed = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Dialog handlers
  const handleOpenDialog = (row) => {
    setRowToUnarchive(row);
    setDialogOpen(true);
  };
  const handleCancelUnarchive = () => {
    setDialogOpen(false);
    setRowToUnarchive(null);
  };
  const handleConfirmUnarchive = async () => {
    if (!rowToUnarchive) return;
    try {
      const numericId = Number(rowToUnarchive.id.split("-")[1]);
      await archiveApi.unarchive(rowToUnarchive.type, [numericId]);
      setRows((prev) => prev.filter((r) => r.id !== rowToUnarchive.id));
      setSnackbar({
        open: true,
        message: `Restored 1 item`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to restore: ${err.message}`,
        severity: "error",
      });
    } finally {
      handleCancelUnarchive();
    }
  };

  // Columns
  const columns = [
    { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
    {
      field: "type",
      headerName: "Type",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const typeMap = {
          students: "Student",
          subjects: "Subject",
          users: "User",
          universities: "School",

          subject_scores: "Exam",
        };
        const colorMap = {
          students: "#4caf50",
          subjects: "#2196f3",
          users: "#ff9800",
          universities: "#9c27b0",

          subject_scores: "#009688",
        };
        return (
          <Chip
            label={typeMap[params.value]}
            size="small"
            sx={{
              backgroundColor: colorMap[params.value],
              color: "#fff",
              fontWeight: 600,
            }}
          />
        );
      },
    },
    {
      field: "archived_by_name",
      headerName: "Archived By",
      width: 140,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "archivedAt",
      headerName: "Archived At",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id, row }) => [
        <GridActionsCellItem
          key={`restore-${row.id}`}
          icon={<UnarchiveIcon />}
          label="restore"
          onClick={() => handleOpenDialog(row)}
          color="primary"
        />,
      ],
    },
  ];

  return (
    <>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "white",
            p: 2,
          }}
        >
          {/* Filters */}
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            mb={2}
            flexWrap="wrap"
          >
            <TextField
              size="small"
              placeholder="Search title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 260 }}
            />
            <TextField
              select
              size="small"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              sx={{ width: 160 }}
            >
              <MenuItem value="all">All types</MenuItem>
              <MenuItem value="students">Student</MenuItem>
              <MenuItem value="subjects">Subject</MenuItem>

              <MenuItem value="universities">School</MenuItem>
              <MenuItem value="subject_scores">Exam</MenuItem>
            </TextField>
          </Box>

          {/* Scrollable DataGrid container */}
          <Box
            sx={{
              flexGrow: 1,
              height: 520,
              overflow: "auto",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 2,
            }}
          >
            <DataGrid
              rows={displayed}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              sx={{
                "& .MuiDataGrid-cell": { py: 0.5, px: 1 },
                "& .MuiDataGrid-root": { border: "1px solid rgba(0,0,0,0.08)" },
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
              hideFooter
              disableColumnMenu
            />
          </Box>

          {/* Pagination */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mt={1}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
              showFirstButton
              showLastButton
            />
            <TextField
              select
              size="small"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              sx={{ ml: 2, width: 100 }}
            >
              <MenuItem value={5}>5 / page</MenuItem>
              <MenuItem value={10}>10 / page</MenuItem>
              <MenuItem value={20}>20 / page</MenuItem>
            </TextField>
          </Box>
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancelUnarchive}>
        <DialogTitle>Confirm Restore</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to restore "{rowToUnarchive?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUnarchive}>Cancel</Button>
          <Button onClick={handleConfirmUnarchive} color="primary">
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.severity === "success" ? (
        <SuccessSnackbar
          open={snackbar.open}
          message={snackbar.message}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        />
      ) : (
        <ErrorSnackbar
          open={snackbar.open}
          message={snackbar.message}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        />
      )}
    </>
  );
}
