import { Box } from "@mui/material";

const ContentBox = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#d3d3d3",
        padding: 2,
        margin: 2,
        borderRadius: 1,
        boxShadow: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  );
};

export default ContentBox;
