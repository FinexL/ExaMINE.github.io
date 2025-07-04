import { Box } from "@mui/material";

const ContentBox = ({ innerStyle = {}, children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#d3d3d3",
        padding: 2,
        margin: 2,
        borderRadius: 1,
        boxShadow: 5,
        minHeight: "200px",

        ...innerStyle,
      }}
    >
      {children}
    </Box>
  );
};

export default ContentBox;
