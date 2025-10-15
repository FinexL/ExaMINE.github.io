import { Children, useMemo } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function NavTabs({
  tabs,
  children,
  basePath,
  routeParam = "tab",
  values = [],
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedIndex = useMemo(() => {
    const param = searchParams.get(routeParam);
    if (!param) return 0;
    return values.findIndex((v) => String(v) === String(param)) || 0;
  }, [searchParams, routeParam, values]);

  const handleChange = (_, newIndex) => {
    const v = values[newIndex];
    const path = basePath;
    navigate(v ? `${path}?${routeParam}=${encodeURIComponent(v)}` : path, {
      replace: false,
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        py: 2,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* Tab Header */}
      <Tabs
        value={selectedIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          px: 1.5,
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            mx: 0.5,
            px: 2.5,
            py: 1,
            transition: "all 0.25s ease",
            color: "text.secondary",
            "&:hover": { bgcolor: "action.hover", color: "primary.main" },
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "secondary.main",
              boxShadow: "0 2px 6px rgba(25,118,210,0.25)",
            },
          },
        }}
      >
        {tabs.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>

      {/* Content */}
      <Box sx={{ p: 3, flexGrow: 1 }}>
        {Children.toArray(children)[selectedIndex]}
      </Box>
    </Paper>
  );
}
