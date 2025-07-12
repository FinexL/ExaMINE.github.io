import * as React from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import StudentTable from "./tables/management/StudentTable";
import UniversityTable from "./tables/management/UniversityTable";
import TopicTable from "./tables/management/TopicTable";
import UserTable from "./tables/management/UserTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`responsive-tabpanel-${index}`}
      aria-labelledby={`responsive-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `responsive-tab-${index}`,
    "aria-controls": `responsive-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const location = useLocation();
  const path = location.pathname;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let tabs = [];
  let content = [];

  switch (path) {
    case "/input-grades":
      tabs = [
        <Tab label="Manual Input" {...a11yProps(0)} key={0} />,
        <Tab label="Import Grades" {...a11yProps(1)} key={1} />,
      ];
      break;

    case "/view-grades":
      tabs = [
        <Tab label="View Grades" {...a11yProps(0)} key={0} />,
        <Tab label="Export Grades" {...a11yProps(1)} key={1} />,
      ];
      break;

    case "/management":
      tabs = [
        <Tab label="Student Data" {...a11yProps(0)} key={0} />,
        <Tab label="University Data" {...a11yProps(1)} key={1} />,
        <Tab label="Topic Data" {...a11yProps(2)} key={2} />,
        <Tab label="User Data" {...a11yProps(3)} key={3} />,
      ];
      content = [
        <StudentTable type={"student"} key="student" />,
        <UniversityTable type={"university"} key="university" />,
        <TopicTable type={"topic"} key="topic" />,
        <UserTable type={"user"} key="user" />,
      ];
      break;

    default:
      break;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Tabs
        orientation={isSmallScreen ? "horizontal" : "vertical"}
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Responsive tabs"
        sx={{
          width: isSmallScreen ? "100%" : "240px",
          minWidth: 240,
          borderRight: isSmallScreen ? 0 : 1,
          borderBottom: isSmallScreen ? 1 : 0,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        {tabs}
      </Tabs>

      <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
        {content.length > 0
          ? content.map((component, index) => (
              <TabPanel value={value} index={index} key={index}>
                {component}
              </TabPanel>
            ))
          : tabs.map((_, index) => (
              <TabPanel value={value} index={index} key={index}>
                {"No Content Yet"} {/* remove later */}
              </TabPanel>
            ))}
      </Box>
    </Box>
  );
}
