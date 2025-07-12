import NavTabs from "../components/NavTabs";
import ContentBox from "../components/ContentBox";
import { Typography } from "@mui/material";

function ViewGrades() {
  return (
    <>
      <Typography variant="h1">View Grades</Typography>

      <ContentBox>
        <NavTabs />
      </ContentBox>
    </>
  );
}

export default ViewGrades;
