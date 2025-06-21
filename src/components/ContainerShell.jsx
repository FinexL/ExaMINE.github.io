import { Box } from "@mui/material";

const ContainerShell = ({ outerStyle = {}, children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#2e2e2e",
        margin: 2,
        padding: 3,
        borderRadius: 1,
        minHeight: "100vh",
        ...outerStyle,
      }}
    >
      {children}
    </Box>
  );
};

export default ContainerShell;
