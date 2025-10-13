import { Typography, Box } from "@mui/material";
import NavTabs from "../../components/layout/NavTabs";

import ContentBox from "../../components/layout/ContentBox";

import useUniversities from "../../hooks/useUniversities";
import OnsiteTable from "./tables/OnsiteTable";
import InhouseTable from "./tables/InhouseTable";

function InputGrades() {
  const { rows: universities } = useUniversities();
  const inhouseUniversities = universities.filter((u) => u.modes === "Inhouse");

  const tabs = ["Onsite", ...inhouseUniversities.map((u) => u.university_name)];

  return (
    <>
      <ContentBox>
        <NavTabs tabs={tabs}>
          <OnsiteTable />

          {inhouseUniversities.map((u) => (
            <Box key={u.university_id}>
              <InhouseTable universityId={u.university_id} />
            </Box>
          ))}
        </NavTabs>
      </ContentBox>
    </>
  );
}

export default InputGrades;
