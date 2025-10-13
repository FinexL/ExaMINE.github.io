import { Box, Typography, IconButton } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import { useState } from "react";

export default function InteractivePieChart({
  data,
  width = 400,
  height = 400,
  title = "",
  onItemClick,
  onReset,
}) {
  const [selectedSlice, setSelectedSlice] = useState(null);

  const total = data.reduce((sum, item) => sum + (item.value ?? 0), 0);

  const coloredData = data.map((item) => ({
    ...item,
    fill: item.color || "#" + Math.floor(Math.random() * 16777215).toString(16),
    stroke: selectedSlice === item.label ? "#FFD700" : "#000",
    strokeWidth: selectedSlice === item.label ? 4 : 2,
  }));

  const handleClick = (event, item) => {
    setSelectedSlice(item.label);
    if (onItemClick) onItemClick(event, item);
  };

  const handleReset = () => {
    setSelectedSlice(null);
    if (onReset) onReset();
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "background.default",
        textAlign: "center",
        borderRadius: 2,
        position: "relative",
      }}
    >
      {/* Title and Reset Icon on same row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {title && (
          <Typography
            variant="h6"
            sx={{ color: "text.primary", fontWeight: "bold" }}
          >
            {title}
          </Typography>
        )}

        <IconButton aria-label="reset" size="small" onClick={handleReset}>
          <UndoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Total below title on left */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", lineHeight: 1 }}>
          {total}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.primary  ", lineHeight: 1 }}
        >
          Students
        </Typography>
      </Box>

      <PieChart
        series={[{ data: coloredData, arcLabel: (item) => `${item.value}` }]}
        width={width}
        height={height}
        onItemClick={handleClick}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: "bold",
            fill: "white",
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
}
