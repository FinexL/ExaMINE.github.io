import { Box, Typography, Alert } from "@mui/material";
import InteractivePieChart from "../../components/charts/InteractivePieChart";
import ReportBox from "../../components/layout/ReportBox";
export default function UniversityChart({
  data,
  loading,
  selectedMode,
  selectedUniversity,
  onSliceClick,
  onReset,
}) {
  return (
    <ReportBox>
      {loading ? (
        <Typography>Loading university chart...</Typography>
      ) : (
        <>
          <InteractivePieChart
            data={data}
            width={200}
            height={200}
            title={
              selectedMode
                ? `Students in ${selectedMode}`
                : "Number of Students Enrolled"
            }
            onItemClick={onSliceClick}
            onReset={onReset}
          />
        </>
      )}
    </ReportBox>
  );
}
