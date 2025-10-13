// buttons/AgExportButton.js
import { Button } from "@mui/material";

export default function AgExportButton({ onClick, fileName = "Report.xlsx" }) {
  return (
    <Button
      variant="outlined"
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
      Export
    </Button>
  );
}
