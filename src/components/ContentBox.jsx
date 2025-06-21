import { Box } from "@mui/material";

const ContentBox = ({ innerStyle = {}, children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#d3d3d3",
        padding: 2,
        borderRadius: 1,
        minHeight: "95vh",
        flex: 1,
        ...innerStyle,
      }}
    >
      {children}
    </Box>
  );
};

export default ContentBox;
