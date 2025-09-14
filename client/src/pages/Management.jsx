import NavTabs from "../components/navigations/NavTabs";
import ContentBox from "../components/ContentBox";
import SeasonIndicator from "../components/indicators/SeasonIndicator";

import { Typography, Box } from "@mui/material";

import StudentTable from "../components/tables/management/StudentTable";
import UniversityTable from "../components/tables/management/UniversityTable";
import SubjectTable from "../components/tables/management/SubjectTable";
//import UserTable from "../components/tables/management/UserTable";

function Management() {
  return (
    <>
      <ContentBox>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="pagename">Management</Typography>
          <Box>
            <SeasonIndicator />
          </Box>
        </Box>
        <Box>
          <NavTabs tabs={["Student", "University", "Subject", "User"]}>
            <StudentTable />
            <UniversityTable />
            <SubjectTable />
            {/*<UserTable />*/}
          </NavTabs>
        </Box>
      </ContentBox>
    </>
  );
}

export default Management;
