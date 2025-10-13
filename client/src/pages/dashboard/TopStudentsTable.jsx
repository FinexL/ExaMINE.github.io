import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import ReportBox from "../../components/layout/ReportBox";

export default function TopStudentsTable({
  dataset,

  title = "Top 20 Performers",
}) {
  return (
    <ReportBox>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", maxHeight: 400 }}
      >
        <Box
          sx={{
            mb: 1,
            display: "flex",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              p: 2,
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: 0.3,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Grades</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataset.map((student) => (
              <TableRow key={student.student_id} hover>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>
                  {student.totalScore != null && student.totalItems != null
                    ? `${student.totalScore} / ${student.totalItems}`
                    : "NO EXAM"}
                </TableCell>
                <TableCell>
                  {student.percent != null ? student.percent : "0"}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportBox>
  );
}
