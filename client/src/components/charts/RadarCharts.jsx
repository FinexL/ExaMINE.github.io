// src/components/charts/RadarCharts.jsx
import { RadarChart } from "@mui/x-charts/RadarChart";

export default function RadarCharts({
  metrics,
  seriesData,
  maxValue = 100,
  width = "100%",
  height = 400,
}) {
  return (
    <RadarChart
      width={typeof width === "number" ? width : undefined}
      height={height}
      series={seriesData}
      radar={{
        max: maxValue,
        metrics: metrics,
      }}
      sx={{ width: width }}
    />
  );
}
