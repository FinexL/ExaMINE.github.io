// BaseSnackbar.jsx
import { Snackbar, IconButton, SnackbarContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BaseSnackbar = ({
  open,
  message,
  onClose,
  icon,
  backgroundColor,
  duration = 6000,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={duration}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <SnackbarContent
      sx={{
        backgroundColor,
        color: "#fff",
        display: "flex",
        alignItems: "center",
      }}
      message={
        <span style={{ display: "flex", alignItems: "center" }}>
          {icon}
          {message}
        </span>
      }
      action={
        <IconButton size="small" color="inherit" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  </Snackbar>
);

export default BaseSnackbar;
