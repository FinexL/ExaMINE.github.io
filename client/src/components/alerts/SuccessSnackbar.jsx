// SuccessSnackbar.jsx
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BaseSnackbar from "./BaseSnackbar";

const SuccessSnackbar = (props) => (
  <BaseSnackbar
    {...props}
    icon={<CheckCircleIcon sx={{ mr: 1 }} />}
    backgroundColor="success.main"
  />
);

export default SuccessSnackbar;
