// src/pages/dashboard/AllStudentsTable.jsx
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import ReportBox from "../../components/layout/ReportBox";

export default function AllStudentsTable({
  title,
  dataset,
  loading,
  selectedUniversity, // optional prop
}) {
  return (
    <ReportBox>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          height: 700,
          backgroundColor: "background.paper",

          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: 0.3,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Table Section */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            borderRadius: 2,
            bgcolor: "background.default",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress size={28} />
            </Box>
          ) : dataset.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", mt: 2 }}
            >
              No students found for this mode.
            </Typography>
          ) : (
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                  {/* Only show School column if not filtered by one university */}
                  {!selectedUniversity && (
                    <TableCell sx={{ fontWeight: 600 }}>School</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600 }}>Total Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Percentage</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {dataset.map((row) => (
                  <TableRow
                    key={row.student_id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>{row.studentName}</TableCell>
                    {!selectedUniversity && (
                      <TableCell>{row.university_name}</TableCell>
                    )}
                    <TableCell>
                      {row.totalScore}/{row.totalItems}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {row.percent}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Paper>
    </ReportBox>
  );
}
