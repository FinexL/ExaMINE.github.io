import { Typography } from "@mui/material";
import ReportBox from "../../components/layout/ReportBox";
import InteractivePieChart from "../../components/charts/InteractivePieChart";

export default function ModeChart({
  data,
  loading,
  selectedMode,
  onSliceClick,
  onReset,
}) {
  // Show all modes if selectedMode is null or "all"
  const filteredData =
    !selectedMode || selectedMode === "all"
      ? data
      : data.filter((item) => item.mode === selectedMode);

  return (
    <ReportBox>
      {loading ? (
        <Typography>Loading mode chart...</Typography>
      ) : (
        <InteractivePieChart
          data={filteredData}
          width={200}
          height={200}
          title={
            !selectedMode || selectedMode === "all"
              ? "Students in Onsite and Inhouse"
              : `Students in ${selectedMode}`
          }
          onItemClick={onSliceClick}
          onReset={onReset}
        />
      )}
    </ReportBox>
  );
}
