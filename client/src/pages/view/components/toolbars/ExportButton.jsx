import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ExportButton = ({ onClick, label = "Export", color = "primary" }) => {
  return (
    <Button
      variant="outlined"
      color={color}
      onClick={onClick}
      sx={{
        textTransform: "none",
        boxShadow: "none",
        borderRadius: 5,
        fontSize: "0.8rem",
        minWidth: 64,
        padding: "8px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FileDownloadIcon sx={{ mr: 1 }} />
      {label}
    </Button>
  );
};

export default ExportButton;
