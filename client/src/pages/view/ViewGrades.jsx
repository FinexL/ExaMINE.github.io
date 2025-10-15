import { Typography, Box } from "@mui/material";
import NavTabs from "../../components/layout/NavTabs";

import useUniversities from "../../hooks/useUniversities";
import OnsiteTable from "./tables/OnsiteTable";
import InhouseTable from "./tables/InhouseTable";

function ViewGrades() {
  const { rows: universities } = useUniversities();
  const inhouseUniversities = universities.filter((u) => u.modes === "Inhouse");

  const tabs = ["Onsite", ...inhouseUniversities.map((u) => u.university_name)];
  const values = [null, ...inhouseUniversities.map((u) => u.university_id)];

  return (
    <>
      <>
        <NavTabs
          tabs={tabs}
          values={values}
          basePath="/view-grades"
          routeParam="uni"
        >
          <OnsiteTable />

          {inhouseUniversities.map((u) => (
            <Box key={u.university_id}>
              <InhouseTable universityId={u.university_id} />
            </Box>
          ))}
        </NavTabs>
      </>
    </>
  );
}

export default ViewGrades;
