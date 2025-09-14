import { Button, Tooltip, useMediaQuery } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useTheme } from "@mui/material/styles";

const SaveButton = ({ onClick, label = "Save", color = "primary" }) => {
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
        maxWidth: isMobile ? 50 : 100,
        minWidth: isMobile ? 36 : 64,
        padding: isMobile ? "6px" : "8px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isMobile ? (
        <SaveIcon />
      ) : (
        <>
          <SaveIcon sx={{ mr: 1 }} />
          {label}
        </>
      )}
    </Button>
  );
};

export default SaveButton;
