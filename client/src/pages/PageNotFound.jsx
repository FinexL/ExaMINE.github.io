import DangerousIcon from "@mui/icons-material/Dangerous";
import { Box } from "@mui/material";

export default function PageNotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <DangerousIcon style={{ fontSize: 100, color: "red" }} />
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </Box>
  );
}
