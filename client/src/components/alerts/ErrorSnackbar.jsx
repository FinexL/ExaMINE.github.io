// ErrorSnackbar.jsx
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BaseSnackbar from "./BaseSnackbar";

const ErrorSnackbar = (props) => (
  <BaseSnackbar
    {...props}
    icon={<WarningAmberIcon sx={{ mr: 1 }} />}
    backgroundColor="error.main"
  />
);

export default ErrorSnackbar;
