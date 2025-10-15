import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useState, Children, useRef, useEffect } from "react";

export default function VerticalTabs({ tabs, children }) {
  const [value, setValue] = useState(0);
  const tabsRef = useRef(null);
  const [tabsWidth, setTabsWidth] = useState("auto");

  useEffect(() => {
    if (tabsRef.current) {
      const totalWidth = Array.from(
        tabsRef.current.querySelectorAll(".MuiTab-root")
      ).reduce((acc, el) => acc + el.offsetWidth, 0);
      setTabsWidth(`${totalWidth + 30}px`);
    }
  }, [tabs]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center", // centers horizontally
        width: "100%",
      }}
    >
      {/* Tabs Header */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 8,
          overflow: "hidden",
          bgcolor: "background.paper",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          py: 0.5,
          width: tabsWidth,
          transition: "width 0.3s ease",
          boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
          border: "1px solid",
          borderColor: "primary.main",
        }}
      >
        <Tabs
          ref={tabsRef}
          value={value}
          onChange={(e, v) => setValue(v)}
          variant="standard"
          sx={{
            minHeight: 50,
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTabs-flexContainer": {
              justifyContent: "center",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",

              py: 1.2,
              borderRadius: 7,
              mx: 0.5,

              color: "text.secondary",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "action.hover",
                color: "primary.main",
              },
              "&.Mui-selected": {
                color: "secondary.main",
                bgcolor: "primary.main",
              },
            },
          }}
        >
          {tabs.map((label, i) => (
            <Tab key={i} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          p: 4,
          width: "100%",

          minHeight: 380,
          border: "1px solid",
          borderColor: "primary.main",

          boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
        }}
      >
        {Children.map(children, (child, index) =>
          index === value ? <Box>{child}</Box> : null
        )}
      </Paper>
    </Box>
  );
}
