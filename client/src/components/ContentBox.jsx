import { Box } from "@mui/material";
//na adjust na rin
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
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ContentBox;
