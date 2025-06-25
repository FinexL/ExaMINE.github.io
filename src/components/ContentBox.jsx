import { Box } from "@mui/material";

const ContentBox = ({ innerStyle = {}, children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#d3d3d3",
        padding: 2,
        margin: 2,
        borderRadius: 1,
        borderStyle: "solid",
        borderWidth: 8,
        minHeight: "flex",

        ...innerStyle,
      }}
    >
      {children}
    </Box>
  );
};

export default ContentBox;
