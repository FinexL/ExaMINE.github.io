import { Button, useMediaQuery } from "@mui/material";
import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";
import { useGridApiContext } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";

export default function ExportButtons({
  label = "Export",
  tableName = "Data",
}) {
  const apiRef = useGridApiContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExport = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `${tableName}_${currentDate}`;

    apiRef.current.exportDataAsCsv({
      fileName,
    });
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
