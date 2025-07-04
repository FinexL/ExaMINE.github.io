import NavTabs from "../components/NavTabs";
import ContentBox from "../components/ContentBox";
import { Typography } from "@mui/material";
import ManagementTable from "../components/Tables/ManagementTable";

function Dashboard() {
  return (
    <>
      <Typography variant="h1">Dashboard</Typography>

      <ContentBox>
        <ManagementTable />
      </ContentBox>
    </>
  );
}

export default Dashboard;
