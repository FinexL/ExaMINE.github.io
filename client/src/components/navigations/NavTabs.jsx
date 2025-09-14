import { useState, Children } from "react";
import { Box, Tabs, Tab } from "@mui/material";

function NavTabs({ tabs, children }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderRadius: 4,
      }}
    >
      <Tabs
        orientation="horizontal"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{
          backgroundColor: "rgba(76, 168, 228, 0.34)",
          px: 2,
        }}
      >
        {tabs.map((tabLabel, index) => (
          <Tab
            label={tabLabel}
            key={index}
            sx={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              borderBottom: value === index ? "none" : "1px solid",
              borderColor: "divider",
              bgcolor: value === index ? "background.paper" : "grey.200",
              color: value === index ? "text.primary" : "text.secondary",
              mx: 0.5,
              textTransform: "none",
              boxShadow: value === index ? 2 : "none",
              zIndex: value === index ? 1 : 0,
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
        {Children.map(children, (child, index) =>
          index === value ? <Box>{child}</Box> : null
        )}
      </Box>
    </Box>
  );
}

export default NavTabs;
