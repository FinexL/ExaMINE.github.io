import NavTabs from "../components/NavTabs";
import ContentBox from "../components/ContentBox";
import { Typography } from "@mui/material";

function Dashboard() {
  return (
    <>
      <Typography variant="h1">Dashboard</Typography>

      <ContentBox>
        <NavTabs />
      </ContentBox>
    </>
  );
}

export default Dashboard;
