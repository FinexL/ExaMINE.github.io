import { Grid, Button, Typography } from "@mui/material";
import NavTabs from "../components/NavTabs";
import ContentBox from "../components/ContentBox";
import ContainerShell from "../components/ContainerShell";
import CustomTable from "../components/CustomTable";

const buttons = [
  <Button key="one">One</Button>,
  <Button key="two">Two</Button>,
  <Button key="three">Three</Button>,
];
function Management() {
  return (
    <>
      <Typography variant="h1">Management</Typography>

      <ContainerShell>
        <Grid container spacing={2}>
          <Grid item sx={{ width: "20vw" }}>
            <ContentBox>
              <NavTabs />
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
