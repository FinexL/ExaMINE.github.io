import { Button, Tooltip, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

const AddButton = ({ onClick, label = "Add", color = "primary" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Button
      variant="contained"
      color={color}
      onClick={onClick}
      sx={{
        textTransform: "none",
        boxShadow: "none",
        borderRadius: 5,
        fontSize: isMobile ? "0.4rem" : "0.8rem",
        minWidth: isMobile ? 36 : 64,
        padding: isMobile ? "6px" : "8px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isMobile ? (
        <AddIcon />
      ) : (
        <>
          <AddIcon sx={{ mr: 1 }} />
          {label}
        </>
      )}
    </Button>
  );
};

export default AddButton;
