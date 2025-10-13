import { Box, Typography } from "@mui/material";
import VerticalTabs from "../../components/layout/VerticalTabs";
import ContentBox from "../../components/layout/ContentBox";

export default function SettingsPage() {
  return (
    <ContentBox>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ p: 3, backgroundColor: "white" }}>
        <VerticalTabs
          tabs={["Profile Settings", "Theme Settings", "Criteria Settings"]}
        >
          <Box>
            <Typography variant="h6">Profile Settings</Typography>
          </Box>

          {/* Tab 2: Theme Settings */}
          <Box>
            <Typography variant="h6">Theme Settings</Typography>
            {/* Add your light/dark theme toggle here */}
          </Box>

          {/* Tab 3: Criteria Settings */}
          <Box>
            <Typography variant="h6">
              Criteria Settings for View Grades
            </Typography>
            {/* Add your criteria configuration here */}
          </Box>
        </VerticalTabs>
      </Box>
    </ContentBox>
  );
}
