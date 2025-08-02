import { Snackbar, IconButton, SnackbarContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SuccessSnackbar = ({ open, message, onClose, duration = 6000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <SnackbarContent
        sx={{
          backgroundColor: "#1cb71cff",
          color: "#fff",
          display: "flex",
          alignItems: "center",
        }}
        message={
          <span style={{ display: "flex", alignItems: "center" }}>
            <CheckCircleIcon sx={{ marginRight: 1 }} />
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
};

export default SuccessSnackbar;
