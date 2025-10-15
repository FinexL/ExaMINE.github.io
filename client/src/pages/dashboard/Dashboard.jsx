// src/pages/dashboard/Dashboard.jsx
import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";

import SeasonIndicator from "../../components/indicators/SeasonIndicator";
import ModeChart from "./ModeChart";
import UniversityChart from "./UniversityChart";
import TopStudentsTable from "./TopStudentsTable";
import AllStudentsTable from "./AllStudentsTable";

import { getExamTypes } from "../../utils/examTypes";
import {
  calculatePercentage,
  calculateTotalScore,
} from "../../utils/calculateTotalScore";
import useTop from "../../hooks/useTop";
import useStudents from "../../hooks/useStudents";
import useUniversities from "../../hooks/useUniversities";
import useStudentGrades from "../../hooks/useStudentGrades";

export default function Dashboard() {
  const { rows: students, loading: studentsLoading } = useStudents();
  const { rows: universities, loading: uniLoading } = useUniversities();
  const loading = studentsLoading || uniLoading;

  const [selectedMode, setSelectedMode] = useState("Onsite");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Grade Data
  const { rows: gradeRows, raw: gradeRaw } = useStudentGrades(selectedMode);
  const uniGradeMode = selectedMode === "all" ? null : selectedMode;

  const { rows: uniGradeRows, raw: uniGradeRaw } = useStudentGrades(
    uniGradeMode,
    selectedUniversity?.university_id || null
  );

  // Exam Types
  const examTypes = useMemo(() => getExamTypes(selectedMode), [selectedMode]);
  useEffect(() => {
    if (examTypes.length) setSelectedExamType(examTypes[0]);
  }, [examTypes]);

  // Chart Data
  const modeChartData = useMemo(() => {
    if (loading) return [];
    const onsiteCount = students.filter((s) => s.modes === "Onsite").length;
    const inhouseCount = students.filter((s) => s.modes === "Inhouse").length;
    return [
      { label: "Onsite", value: onsiteCount, color: "#36A2EB" },
      { label: "Inhouse", value: inhouseCount, color: "#FF6384" },
    ];
  }, [students, loading]);

  const universityChartData = useMemo(() => {
    if (loading) return [];
    return universities
      .map((uni) => {
        const count = students.filter((s) => {
          if (!selectedMode || selectedMode === "all") {
            return s.university_id === uni.university_id;
          }
          return (
            s.university_id === uni.university_id &&
            s.modes.toLowerCase() === selectedMode.toLowerCase()
          );
        }).length;
        return {
          label: uni.university_name,
          university_id: uni.university_id,
          value: count,
          color:
            uni.color ||
            "#" + Math.floor(Math.random() * 16777215).toString(16),
        };
      })
      .filter((d) => d.value > 0);
  }, [students, universities, selectedMode, loading]);

  // Handlers
  const handleModeClick = (event, slice) => {
    const clicked = modeChartData[slice.dataIndex];
    setSelectedMode(clicked.label);
    setSelectedUniversity(null);
  };
  const handleUniversityClick = (event, slice) => {
    const clicked = universityChartData[slice.dataIndex];
    setSelectedUniversity(clicked);
  };
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleExamSelect = (type) => {
    setSelectedExamType(type);
    handleMenuClose();
  };

  // Dataset Builder
  const buildDataset = (rows, rawSubjects, examType = null) => {
    const filteredSubjects = examType
      ? rawSubjects.subjects.filter((sub) => sub.exam_type === examType)
      : rawSubjects.subjects;
    return rows
      .map((row) => {
        const { total, maxTotal } = calculateTotalScore(row, filteredSubjects);
        const percent = calculatePercentage(total, maxTotal).toFixed(1);
        return {
          student_id: row.student_id,
          studentName: row.studentName,
          university_name: row.university_name,
          totalScore: total,
          totalItems: maxTotal,
          percent,
        };
      })
      .sort((a, b) => b.percent - a.percent);
  };

  const { topStudents: topUniStudentsDataset } = useTop(
    selectedUniversity?.university_id || null,
    20
  );

  // Render
  return (
    <>
      <Box sx={{ bgcolor: "white" }}>
        {/* --- Charts and Tables Layout --- */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",

            flexWrap: "wrap",
          }}
        >
          {/* --- Left Column: Charts --- */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",

              width: { xs: "100%", md: "40%" },
              maxWidth: 500,
              minHeight: 600,
            }}
          >
            <ModeChart
              data={modeChartData}
              loading={loading}
              onSliceClick={handleModeClick}
              onReset={() => {
                setSelectedMode("all");
                setSelectedUniversity(null);
              }}
            />

            <UniversityChart
              data={universityChartData}
              loading={loading}
              selectedMode={selectedMode}
              selectedUniversity={selectedUniversity}
              onSliceClick={handleUniversityClick}
              onReset={() => setSelectedUniversity("")}
            />
          </Box>

          <Box sx={{ p: 2 }}>
            <AllStudentsTable
              title={`All ${
                selectedMode === "all" ? "Merge" : selectedMode
              } Students`}
              dataset={buildDataset(gradeRows, gradeRaw, selectedExamType)}
              loading={loading}
            />
          </Box>
        </Box>

        {/* --- Top Performers Table --- */}
        <Box sx={{ p: 2 }}>
          {selectedUniversity ? (
            <TopStudentsTable
              title={`Top 20 Performers in ${selectedUniversity.label} (${selectedMode})`}
              dataset={topUniStudentsDataset}
              examTypes={examTypes}
              selectedExamType={selectedExamType}
              selectedUniversityId={selectedUniversity.value}
              onExamSelect={handleExamSelect}
              anchorEl={anchorEl}
              onMenuOpen={handleMenuOpen}
              onMenuClose={handleMenuClose}
            />
          ) : (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Select a university from the chart to view top performers.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
