import { Button, useMediaQuery } from "@mui/material";
import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";
import { useGridApiContext } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import * as XLSX from "xlsx";

export default function MuiExportButtons({
  label = "Export",
  tableName = "Data",
}) {
  const apiRef = useGridApiContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExport = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `${tableName}_${currentDate}.xlsx`;

    // Get row data and column info from DataGrid
    const rowData = Array.from(apiRef.current.getRowModels().values());
    const columns = apiRef.current
      .getAllColumns()
      .filter((col) => col.field !== "__check__" && col.field !== "actions")
      .map((col) => ({ field: col.field, headerName: col.headerName }));

    // Map rows to use headerName as keys
    const formattedRows = rowData.map((row) => {
      const formatted = {};
      columns.forEach((col) => {
        formatted[col.headerName] = row[col.field];
      });
      return formatted;
    });

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedRows);

    // Auto-adjust column widths based on content
    const colWidths = columns.map((col) => {
      const headerLength = col.headerName.length;
      const maxCellLength = Math.max(
        ...formattedRows.map((row) => {
          const value = row[col.headerName];
          return value ? String(value).length : 0;
        })
      );
      return { wch: Math.max(headerLength, maxCellLength) + 2 }; // add padding
    });
    worksheet["!cols"] = colWidths;

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export XLSX
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Button
      variant="outlined"
      onClick={handleExport}
      sx={{
        textTransform: "none",
        boxShadow: "none",
        borderRadius: 5,
        fontSize: isMobile ? "0.6rem" : "0.8rem",
        minWidth: isMobile ? 36 : 64,
        padding: isMobile ? "6px" : "8px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: "auto",
      }}
    >
      {isMobile ? (
        <FileDownloadSharpIcon />
      ) : (
        <>
          <FileDownloadSharpIcon sx={{ mr: 1 }} />
          {label}
        </>
      )}
    </Button>
  );
}
