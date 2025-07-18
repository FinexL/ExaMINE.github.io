import React from "react";
import { Box, Tabs, Tab, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
function NavTabs({ tabs, children }) {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        sx={{
          width: isSmallScreen ? "100%" : "240px",
          minWidth: 240,
          borderRight: isSmallScreen ? 0 : 1,
          borderBottom: isSmallScreen ? 1 : 0,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        {tabs.map((tabLabel, index) => (
          <Tab label={tabLabel} key={index} />
        ))}
      </Tabs>

      <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
        {React.Children.map(children, (child, index) =>
          index === value ? <Box>{child}</Box> : null
        )}
      </Box>
    </Box>
  );
}

export default NavTabs;
