import { Typography, Box } from "@mui/material";
import NavTabs from "../components/navigations/NavTabs";
import SeasonIndicator from "../components/indicators/SeasonIndicator";

import Overview from "./Overview";
import ContentBox from "../components/ContentBox";

import useUniversities from "../hooks/useUniversities";
import OnsiteTable from "../components/tables/input/OnsiteTable";

function InputGrades() {
  const { rows: universities } = useUniversities();
  const inhouseUniversities = universities.filter(
    (u) => u.modes === "Inhouse" || u.modes === "Onsite & Inhouse"
  );

  const tabs = [
    "Overview",
    "Onsite",
    ...inhouseUniversities.map((u) => u.university_name),
  ];

  return (
    <>
      <ContentBox>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="pagename">Input Grades</Typography>
          <SeasonIndicator />
        </Box>

        <NavTabs tabs={tabs}>
          <Overview />

          <OnsiteTable />
          {inhouseUniversities.map((u) => (
            <Box key={u.university_id}>
              <Typography variant="h6">{u.university_name}</Typography>
              <Typography>Inhouse Content for {u.university_name}</Typography>
            </Box>
          ))}
        </NavTabs>
      </ContentBox>
    </>
  );
}

export default InputGrades;
