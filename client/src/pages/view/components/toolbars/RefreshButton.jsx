import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const RefreshButton = ({ onClick, color = "primary" }) => {
  return (
    <Button
      variant="contained"
      color={color}
      onClick={onClick}
      sx={{
        minWidth: 40,
        minHeight: 40,
        padding: 0,
        borderRadius: 5,
        boxShadow: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RefreshIcon />
    </Button>
  );
};

export default RefreshButton;
