import NavTabs from "../components/NavTabs";
import ContentBox from "../components/ContentBox";
import { Typography } from "@mui/material";

function Management() {
  return (
    <>
      <Typography variant="h1">Management</Typography>

      <ContentBox>
        <NavTabs />
      </ContentBox>
    </>
  );
}

export default Management;
