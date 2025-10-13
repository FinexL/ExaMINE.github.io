import { Box } from "@mui/material";
import CriteriaButton from "./CriteriaButton";
import ExportButton from "./ExportButton";
import SearchBar from "../../../../components/searchbar/searchbar";

export default function ViewGradeToolbar({
  gridRef,
  filteredSubjects,
  criteriaValues,
  tableName = "Data",
  quickFilter,
  setQuickFilter,
  headerSearch,
  setHeaderSearch,
  onCriteriaClick,
  onExportClick,
}) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      mb={1}
      flexWrap="wrap"
    >
      {/* Left: search bars */}
      <Box display="flex" gap={1}>
        <SearchBar
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          placeholder="Search all rows..."
        />
        <SearchBar
          value={headerSearch}
          onChange={(e) => setHeaderSearch(e.target.value)}
          placeholder="Search headers..."
        />
      </Box>

      {/* Right: criteria & export buttons */}
      <Box display="flex" alignItems="center" gap={1}>
        <ExportButton onClick={onExportClick} />
        <CriteriaButton onClick={onCriteriaClick} />{" "}
        {/* call parent callback */}
      </Box>
    </Box>
  );
}
