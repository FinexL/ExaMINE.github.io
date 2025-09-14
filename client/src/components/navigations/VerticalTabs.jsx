import { Box, Tabs, Tab } from "@mui/material";
import { useState, Children } from "react";

export default function VerticalTabs({ tabs, children }) {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "20%",
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 2,
        }}
      >
        <Tabs
          orientation="vertical"
          value={value}
          onChange={(e, v) => setValue(v)}
        >
          {tabs.map((label, i) => (
            <Tab key={i} label={label} sx={{ textTransform: "none" }} />
          ))}
        </Tabs>
      </Box>

      {/* Right content */}
      <Box
        sx={{
          flexGrow: 1,
          width: "80%",
          p: 2,
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 2,
        }}
      >
        {Children.map(children, (child, index) =>
          index === value ? <Box>{child}</Box> : null
        )}
      </Box>
    </Box>
  );
}
