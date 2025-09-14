import { Box, Typography } from "@mui/material";
import VerticalTabs from "../components/navigations/VerticalTabs";
import useUniversities from "../hooks/useUniversities";

export default function Overview() {
  const { rows: universities } = useUniversities();

  const inhouseUniversities = universities.filter(
    (u) => u.modes === "Inhouse" || u.modes === "Onsite & Inhouse"
  );

  const tabs = ["Onsite", ...inhouseUniversities.map((u) => u.university_name)];

  return (
    <Box>
      <VerticalTabs tabs={tabs}>
        {/* --- Tab 1 Content: Onsite --- */}
        <Box>
          <Typography variant="h6">Onsite Content</Typography>
        </Box>

        {/* --- Tab 2+ Content: Each Inhouse university --- */}
        {inhouseUniversities.map((u) => (
          <Box key={u.university_id}>
            <Typography variant="h6">{u.university_name}</Typography>
            <Typography>Inhouse Content for {u.university_name}</Typography>
          </Box>
        ))}
      </VerticalTabs>
    </Box>
  );
}
