// components/layout/ReportBox.js
import { Box } from "@mui/material";

export default function ReportBox({ children, ...props }) {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "secondary.main",
        borderRadius: 2,
        p: 2,
        border: 1,
        borderColor: "divider",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
