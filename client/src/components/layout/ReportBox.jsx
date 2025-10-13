// components/layout/ReportBox.js
import { Box } from "@mui/material";

export default function ReportBox({ children, ...props }) {
  return (
    <Box
      sx={{
        bgcolor: "rgba(76, 168, 228, 0.34)",
        borderRadius: 2,
        p: 1,
        border: "1px solid #ccc",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
