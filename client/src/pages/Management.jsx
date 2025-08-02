import NavTabs from "../components/NavTabs";
import ContentBox from "../components/ContentBox";
import { Typography } from "@mui/material";

import StudentTable from "../components/tables/management/StudentTable";
import UniversityTable from "../components/tables/management/UniversityTable";
import TopicTable from "../components/tables/management/TopicTable";
import UserTable from "../components/tables/management/UserTable";

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
        <Typography variant="h1" gutterBottom>
          Management
        </Typography>
        <NavTabs tabs={tabLabels}>
          <StudentTable />
          <UniversityTable />
          <TopicTable />
          <UserTable />
        </NavTabs>
      </ContentBox>
    </>
  );
}

export default Management;
