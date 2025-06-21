import { Box, Grid, Paper, Stack } from "@mui/material";
import ContentBox from "../components/ContentBox";
import ContainerShell from "../components/ContainerShell";
import CustomTable from "../components/CustomTable";

function Management() {
  return (
    <>
      <Box mb={2}>
        <h1>Management</h1>
      </Box>

      <ContainerShell>
        <Grid container spacing={2}>
          <Grid item sx={{ width: "20vw" }}>
            <ContentBox>
              <Stack spacing={2}>
                <h3>Student Data</h3>
                <h3>University Data</h3>
                <h3>Subject Data</h3>
              </Stack>
            </ContentBox>
          </Grid>

          <Grid item sx={{ flex: 1 }}>
            <ContentBox>
              <CustomTable />
            </ContentBox>
          </Grid>
        </Grid>
      </ContainerShell>
    </>
  );
}

export default Management;
