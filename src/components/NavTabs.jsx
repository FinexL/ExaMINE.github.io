import * as React from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const location = useLocation();
  const path = location.pathname;

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  let tabs = [];

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
        <Tab label="Subject Data" {...a11yProps(2)} key={2} />,
        <Tab label="User Data" {...a11yProps(3)} key={3} />,
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
        flex: "1",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ width: "flex", borderRight: 5, borderColor: "divider" }}
      >
        {tabs}
      </Tabs>
      {tabs.map((_, index) => (
        <TabPanel value={value} index={index} key={index}>
          {`Content for tab ${index + 1}`}
        </TabPanel>
      ))}
    </Box>
  );
}
