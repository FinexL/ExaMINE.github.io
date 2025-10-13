import NavTabs from "../../components/layout/NavTabs";
import ContentBox from "../../components/layout/ContentBox";

import { Typography, Box } from "@mui/material";

import StudentTable from "./tables/StudentTable";
import UniversityTable from "./tables/UniversityTable";
import SubjectTable from "./tables/SubjectTable";
import UserTable from "./tables/UserTable";

function Management() {
  return (
    <>
      <ContentBox>
        <Box>
          <NavTabs tabs={["Student", "School", "Subject", "User"]}>
            <StudentTable />
            <UniversityTable />
            <SubjectTable />
            <UserTable />
          </NavTabs>
        </Box>
      </ContentBox>
    </>
  );
}

export default Management;
