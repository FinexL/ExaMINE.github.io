import NavTabs from "../components/NavTabs";
import ContentBox from "../components/ContentBox";
import SeasonIndicator from "../components/indicators/SeasonIndicator";

import { Typography, Box } from "@mui/material";

import StudentTable from "../components/tables/management/StudentTable";
import UniversityTable from "../components/tables/management/UniversityTable";
import TopicTable from "../components/tables/management/TopicTable";
//import UserTable from "../components/tables/management/UserTable";

function Management() {
  const tabLabels = [
    "Student Data",
    "University Data",
    "Topic Data",
    "User Data",
  ];

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
          <NavTabs tabs={tabLabels}>
            <StudentTable />
            <UniversityTable />
            <TopicTable />
            {/*<UserTable />*/}
          </NavTabs>
        </Box>
      </ContentBox>
    </>
  );
}

export default Management;
