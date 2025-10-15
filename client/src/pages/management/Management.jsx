import NavTabs from "../../components/layout/NavTabs";

import { Typography, Box } from "@mui/material";

import StudentTable from "./tables/StudentTable";
import UniversityTable from "./tables/UniversityTable";
import SubjectTable from "./tables/SubjectTable";
import UserTable from "./tables/UserTable";

function Management() {
  return (
    <>
      <Box>
        <NavTabs
          tabs={["Student", "School", "Subject", "User"]}
          values={["student", "school", "subject", "user"]}
          basePath="/management"
          routeParam="tab"
        >
          <StudentTable />
          <UniversityTable />
          <SubjectTable />
          <UserTable />
        </NavTabs>
      </Box>
    </>
  );
}

export default Management;
