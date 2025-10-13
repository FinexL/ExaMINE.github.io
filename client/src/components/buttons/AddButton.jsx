import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddButton = ({ onClick, label = "Add", color = "primary" }) => {
  return (
    <Button
      variant="contained"
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
      <AddIcon sx={{ mr: 1 }} />
      {label}
    </Button>
  );
};

export default AddButton;
