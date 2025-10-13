import { Box, Typography } from "@mui/material";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

export default function PieArcChart({
  data,
  width = 400,
  height = 400,
  title = "",
}) {
  const coloredData = data.map((item) => ({
    ...item,
    fill: item.color,
    stroke: "#000000",
    strokeWidth: 2,
  }));

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "background.default",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      {/* Title on top-left */}
      {title && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
          <Typography variant="h6" sx={{ color: "text.primary" }}>
            {title}
          </Typography>
        </Box>
      )}

      <PieChart
        series={[
          {
            data: coloredData,
            arcLabel: (item) => `${item.value}`,
            arcLabelMinAngle: 25,
            arcLabelRadius: "60%",
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: "bold",
            fill: "white",
          },
        }}
        width={width}
        height={height}
      />
    </Box>
  );
}
