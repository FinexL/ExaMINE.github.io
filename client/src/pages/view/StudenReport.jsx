import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Divider,
  Button,
} from "@mui/material";

import ContentBox from "../../components/layout/ContentBox";
import ReportBox from "../../components/layout/ReportBox";
import useGradeCriteria from "../../hooks/useGradeCriteria";
import { computeGradeColor } from "../../utils/computeGradeColor";
import SeasonIndicator from "../../components/indicators/SeasonIndicator";
import PieArcChart from "../../components/charts/PieChart";

export default function StudentReport() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { criteria } = useGradeCriteria("Onsite");

  useEffect(() => {
    api
      .get(`/student_grades/${id}/grades`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data || "Error fetching grades"));
  }, [id]);

  // Generate a single recommendation based on overall total percentage across all exam types
  const recommendations = useMemo(() => {
    if (!data) return [];

    let totalScore = 0;
    let totalItems = 0;

    Object.values(data.examTypes).forEach((subjects) => {
      totalScore += subjects.reduce((sum, s) => sum + (s.score ?? 0), 0);
      totalItems += subjects.reduce((sum, s) => sum + (s.items ?? 0), 0);
    });

    if (totalItems === 0) {
      return [
        `No exams recorded yet. Once exams are taken, a recommendation will be generated automatically.`,
      ];
    }

    const overallPercent = (totalScore / totalItems) * 100;

    if (overallPercent < 60) {
      return [
        `Performance Alert: You’re below the passing rate this time. Keep reviewing and stay motivated — success is within reach, future RN!`,
      ];
    } else {
      return [
        `Excellent work! You’ve achieved the required passing rate and are ready for the PNLE. Keep up your study habits and confidence — you’re one step closer to becoming an RN!`,
      ];
    }
  }, [data]);

  // Flag counts
  const flagCounts = useMemo(() => {
    if (!data || !criteria) return {};
    const counts = { red: 0, yellow: 0, green: 0, blue: 0, black: 0 };
    Object.values(data.examTypes).forEach((subjects) => {
      subjects.forEach((subj) => {
        let color =
          subj.score == null
            ? "blue"
            : computeGradeColor(subj.score, subj.items, criteria);
        counts[color] = (counts[color] || 0) + 1;
      });
    });
    return counts;
  }, [data, criteria]);

  // Top / Worst subjects
  const topWorstSubjects = useMemo(() => {
    if (!data) return { top: [], worst: [], noExam: [] };
    let allSubjects = [];
    let noExamSubjects = [];
    Object.entries(data.examTypes).forEach(([examType, subjects]) => {
      subjects.forEach((subj) => {
        if (subj.score != null && subj.items != null) {
          allSubjects.push({
            ...subj,
            percent: (subj.score / subj.items) * 100,
            examType,
          });
        } else {
          noExamSubjects.push({
            ...subj,
            examType,
          });
        }
      });
    });
    if (!allSubjects.length)
      return { top: [], worst: [], noExam: noExamSubjects };
    const sortedDesc = [...allSubjects].sort((a, b) => b.percent - a.percent);
    const sortedAsc = [...allSubjects].sort((a, b) => a.percent - b.percent);
    return {
      top: sortedDesc.slice(0, 5),
      worst: sortedAsc.slice(0, 5),
      noExam: noExamSubjects,
    };
  }, [data]);

  // Generate remarks based on flagCounts or other criteria
  const remarksSections = useMemo(() => {
    if (!data) return [];

    const noExamSubjects = topWorstSubjects.noExam.map((s) => s.subject_name);
    const failingSubjects = Object.values(data.examTypes)
      .flat()
      .filter(
        (s) =>
          s.score != null &&
          computeGradeColor(s.score, s.items, criteria) === "red"
      )
      .map((s) => s.subject_name);
    const satisfactorySubjects = Object.values(data.examTypes)
      .flat()
      .filter(
        (s) =>
          s.score != null &&
          computeGradeColor(s.score, s.items, criteria) === "yellow"
      )
      .map((s) => s.subject_name);
    const excellentSubjects = Object.values(data.examTypes)
      .flat()
      .filter(
        (s) =>
          s.score != null &&
          ["green", "white"].includes(
            computeGradeColor(s.score, s.items, criteria)
          )
      )
      .map((s) => s.subject_name);
    const errorSubjects = Object.values(data.examTypes)
      .flat()
      .filter(
        (s) =>
          s.score != null &&
          computeGradeColor(s.score, s.items, criteria) === "black"
      )
      .map((s) => s.subject_name);

    const sections = [];

    if (noExamSubjects.length > 0) {
      sections.push({ title: "No Exam Recorded", content: noExamSubjects });
    }
    if (failingSubjects.length > 0) {
      sections.push({ title: "Needs Improvement", content: failingSubjects });
    }
    if (satisfactorySubjects.length > 0) {
      sections.push({
        title: "Satisfactory Performance",
        content: satisfactorySubjects,
      });
    }
    if (excellentSubjects.length > 0) {
      sections.push({
        title: "Excellent Performance",
        content: excellentSubjects,
      });
    }
    if (errorSubjects.length > 0) {
      sections.push({ title: "Input Errors", content: errorSubjects });
    }

    if (sections.length === 0) {
      sections.push({
        title: "Average Performance",
        content: ["Performance is average."],
      });
    }

    return sections;
  }, [data, criteria, topWorstSubjects]);

  if (error)
    return <Typography color="error">{JSON.stringify(error)}</Typography>;
  if (!data) return <Typography>Loading...</Typography>;

  return (
    <ContentBox>
      <Box p={3} sx={{ bgcolor: "white" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/view-grades")}
          sx={{ mb: 2 }}
        >
          &larr; Back
        </Button>
        <Box sx={{ mb: 3 }}>
          {/* Header Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap: 1,
            }}
          >
            <Divider
              sx={{ flexGrow: 1, height: 2, bgcolor: "primary.light" }}
            />
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ color: "primary.main", textTransform: "uppercase", mx: 2 }}
            >
              Student Report
            </Typography>
            <Divider
              sx={{ flexGrow: 1, height: 2, bgcolor: "primary.light" }}
            />
          </Box>

          {/* Single-line Info */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              <b>Student Name:</b> {data.studentName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight={500}>
                <b>Season:</b>
              </Typography>
              <SeasonIndicator variant="h6" />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              <b>University:</b> {data.university_name}
            </Typography>

            <Typography variant="h6" fontWeight={500}>
              <b>Date:</b> {new Date().toLocaleDateString()}
            </Typography>
          </Box>

          <Divider sx={{ mt: 2, height: 2, bgcolor: "primary.light" }} />
        </Box>

        <Box display="flex" flexDirection="row" gap={3}>
          {/* Column 1: Exam tables */}
          <Box
            sx={{ width: 350 }}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            {Object.entries(data.examTypes).map(([examType, subjects]) => {
              const totalScore = subjects.reduce(
                (sum, subj) => sum + (subj.score ?? 0),
                0
              );
              const totalItems = subjects.reduce(
                (sum, subj) => sum + (subj.items ?? 0),
                0
              );

              return (
                <ReportBox
                  key={examType}
                  display="flex"
                  flexDirection="column"
                  gap={1}
                >
                  <Typography variant="h6">{examType}</Typography>
                  <TableContainer component={Paper}>
                    <Table size="small" sx={{ tableLayout: "fixed" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ wordBreak: "break-word", maxWidth: 150 }}
                          >
                            <b>Subject</b>
                          </TableCell>
                          <TableCell>
                            <b>Score</b>
                          </TableCell>
                          <TableCell>
                            <b>Percent</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subjects.map((subj, i) => {
                          const color =
                            subj.score == null
                              ? "blue"
                              : computeGradeColor(
                                  subj.score,
                                  subj.items,
                                  criteria
                                );

                          const cellStyle = {
                            backgroundColor:
                              color === "red"
                                ? "#f28b82"
                                : color === "yellow"
                                ? "#fff475"
                                : color === "green"
                                ? "#ccff90"
                                : color === "blue"
                                ? "#bbdefb"
                                : color === "black"
                                ? "#000000"
                                : "#ffffff",
                            color: color === "black" ? "#fff" : "inherit",
                          };

                          const percentage =
                            subj.score != null && subj.items
                              ? ((subj.score / subj.items) * 100).toFixed(1)
                              : null;

                          return (
                            <TableRow key={i}>
                              <TableCell
                                sx={{ wordBreak: "break-word", maxWidth: 150 }}
                              >
                                {subj.subject_name}
                              </TableCell>
                              <TableCell sx={cellStyle}>
                                {subj.score != null
                                  ? `${subj.score}/${subj.items}`
                                  : "NO EXAM"}
                              </TableCell>
                              <TableCell sx={cellStyle}>
                                {percentage != null ? `${percentage}%` : "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}

                        {/* Total Row */}
                        {totalItems > 0 &&
                          (() => {
                            const totalColor = computeGradeColor(
                              totalScore,
                              totalItems,
                              criteria
                            );
                            const totalCellStyle = {
                              backgroundColor:
                                totalColor === "red"
                                  ? "#f28b82"
                                  : totalColor === "yellow"
                                  ? "#fff475"
                                  : totalColor === "green"
                                  ? "#ccff90"
                                  : totalColor === "blue"
                                  ? "#bbdefb"
                                  : totalColor === "black"
                                  ? "#000000"
                                  : "#ffffff",
                              color:
                                totalColor === "black" ? "#fff" : "inherit",
                            };

                            const totalPercentage = (
                              (totalScore / totalItems) *
                              100
                            ).toFixed(1);

                            return (
                              <TableRow>
                                <TableCell>
                                  <b>Total</b>
                                </TableCell>
                                <TableCell sx={totalCellStyle}>
                                  <b>
                                    {totalScore}/{totalItems}
                                  </b>
                                </TableCell>
                                <TableCell sx={totalCellStyle}>
                                  <b>{totalPercentage}%</b>
                                </TableCell>
                              </TableRow>
                            );
                          })()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ReportBox>
              );
            })}
          </Box>

          {/* Column */}
          <Box flex={1} display="flex" flexDirection="column" gap={3}>
            {/* */}
            <Box display="flex" flexDirection="row" gap={2}>
              {/* Highest 5 */}
              <ReportBox flex={1}>
                <Typography variant="h6" gutterBottom>
                  Top 5 Highest-Scoring Subjects
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small" sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                      {" "}
                      {/* Header background */}
                      <TableRow>
                        <TableCell>
                          <b>Subject</b>
                        </TableCell>
                        <TableCell>
                          <b>Score</b>
                        </TableCell>
                        <TableCell>
                          <b>Percent</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topWorstSubjects.top.map((subj) => {
                        const color = computeGradeColor(
                          subj.score,
                          subj.items,
                          criteria
                        );
                        const rowStyle = {
                          backgroundColor:
                            color === "red"
                              ? "#f28b82"
                              : color === "yellow"
                              ? "#fff475"
                              : color === "green"
                              ? "#ccff90"
                              : color === "blue"
                              ? "#bbdefb"
                              : color === "black"
                              ? "#000000"
                              : "#ffffff",
                          color: color === "black" ? "#fff" : "inherit",
                        };
                        return (
                          <TableRow key={subj.subject_id} sx={rowStyle}>
                            <TableCell>{subj.subject_name}</TableCell>
                            <TableCell>
                              {subj.score}/{subj.items}
                            </TableCell>
                            <TableCell>{subj.percent.toFixed(1)}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ReportBox>

              {/* Lowest 5 */}
              <ReportBox flex={1}>
                <Typography variant="h6" gutterBottom>
                  Top 5 Lowest-Scoring Subjects
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small" sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Subject</b>
                        </TableCell>
                        <TableCell>
                          <b>Score</b>
                        </TableCell>
                        <TableCell>
                          <b>Percent</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topWorstSubjects.worst.map((subj) => {
                        const color = computeGradeColor(
                          subj.score,
                          subj.items,
                          criteria
                        );
                        const rowStyle = {
                          backgroundColor:
                            color === "red"
                              ? "#f28b82"
                              : color === "yellow"
                              ? "#fff475"
                              : color === "green"
                              ? "#ccff90"
                              : color === "blue"
                              ? "#bbdefb"
                              : color === "black"
                              ? "#000000"
                              : "#ffffff",
                          color: color === "black" ? "#fff" : "inherit",
                        };
                        return (
                          <TableRow key={subj.subject_id} sx={rowStyle}>
                            <TableCell>{subj.subject_name}</TableCell>
                            <TableCell>
                              {subj.score}/{subj.items}
                            </TableCell>
                            <TableCell>{subj.percent.toFixed(1)}%</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ReportBox>
            </Box>

            {/* Pie chart + No Exam side by side */}
            <Box display="flex" flexDirection="row" gap={2} maxHeight={300}>
              {/* PIE */}
              <ReportBox>
                <Typography variant="h6" gutterBottom>
                  Flags Summary
                </Typography>
                <PieArcChart
                  data={[
                    {
                      label: "Excellent",
                      value: flagCounts.white ?? 0,
                      color: "#e0e0e0",
                    },
                    {
                      label: "Passed",
                      value: flagCounts.green ?? 0,
                      color: "#a5d6a7",
                    },
                    {
                      label: "Satisfactory",
                      value: flagCounts.yellow ?? 0,
                      color: "#fff176",
                    },
                    {
                      label: "Failed",
                      value: flagCounts.red ?? 0,
                      color: "#ef9a9a",
                    },
                    {
                      label: "No Exam",
                      value: flagCounts.blue ?? 0,
                      color: "#90caf9",
                    },
                    {
                      label: "Input Error",
                      value: flagCounts.black ?? 0,
                      color: "#616161",
                    },
                  ]}
                  width={200}
                  height={200}
                />
              </ReportBox>
              {/* NO EXAM TABLE */}
              <ReportBox flex={1}>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    maxHeight: 300,
                    bgcolor: "white",
                    borderRadius: 2,
                    height: "85%",
                    p: 2,
                  }}
                >
                  {recommendations.length > 0 ? (
                    recommendations.map((rec, index) => {
                      const isAlert = rec.toLowerCase().includes("alert");
                      return (
                        <Paper
                          key={index}
                          elevation={2}
                          sx={{
                            p: 2,
                            bgcolor: isAlert ? "#ffebee" : "#e8f5e9", // red for alerts, green for good
                            borderLeft: isAlert
                              ? "6px solid #f44336"
                              : "6px solid #4caf50", // visual indicator
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: isAlert ? "#b71c1c" : "#1b5e20",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {rec}
                          </Typography>
                        </Paper>
                      );
                    })
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      No recommendations available.
                    </Typography>
                  )}
                </Box>
              </ReportBox>
            </Box>
            <ReportBox>
              <Typography variant="h6" gutterBottom>
                Remarks
              </Typography>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  p: 2,
                  border: "1px solid #ccc",
                }}
              >
                {remarksSections.map((section, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    {index > 0 && <Divider sx={{ my: 1 }} />}
                    <Typography variant="subtitle1" fontWeight="bold">
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-line", mt: 0.5 }}
                    >
                      {section.content.join(", ")}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </ReportBox>
          </Box>
        </Box>
      </Box>
    </ContentBox>
  );
}
