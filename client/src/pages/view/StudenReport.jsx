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
  Paper,
  Divider,
  Button,
} from "@mui/material";

import ReportBox from "../../components/layout/ReportBox";
import useGradeCriteria from "../../hooks/useGradeCriteria";
import { computeGradeColor } from "../../utils/computeGradeColor";
import {
  getCellStyle,
  getChartColor,
  getRecommendationStyle,
} from "./components/utils/colorMap";
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

  // Recommendations
  const recommendations = useMemo(() => {
    if (!data) return [];

    let totalScore = 0;
    let totalItems = 0;

    Object.values(data.examTypes).forEach((subjects) => {
      totalScore += subjects.reduce((sum, s) => sum + (s.score ?? 0), 0);
      totalItems += subjects.reduce((sum, s) => sum + (s.items ?? 0), 0);
    });

    if (totalItems === 0)
      return [
        "No exams recorded yet. Once exams are taken, a recommendation will be generated automatically.",
      ];

    const percent = (totalScore / totalItems) * 100;
    return percent < 60
      ? [
          "Performance Alert: You’re below the passing rate this time. Keep reviewing and stay motivated — success is within reach, future RN!",
        ]
      : [
          "Excellent work! You’ve achieved the required passing rate and are ready for the PNLE. Keep up your study habits and confidence — you’re one step closer to becoming an RN!",
        ];
  }, [data]);

  // Flag counts
  const flagCounts = useMemo(() => {
    if (!data || !criteria) return {};
    const counts = { red: 0, yellow: 0, green: 0, blue: 0, black: 0 };
    Object.values(data.examTypes).forEach((subjects) => {
      subjects.forEach((subj) => {
        const color =
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
    const all = [];
    const noExam = [];
    Object.entries(data.examTypes).forEach(([examType, subjects]) => {
      subjects.forEach((s) =>
        s.score != null && s.items != null
          ? all.push({ ...s, percent: (s.score / s.items) * 100, examType })
          : noExam.push({ ...s, examType })
      );
    });
    if (!all.length) return { top: [], worst: [], noExam };
    const sortedDesc = [...all].sort((a, b) => b.percent - a.percent);
    const sortedAsc = [...all].sort((a, b) => a.percent - b.percent);
    return {
      top: sortedDesc.slice(0, 5),
      worst: sortedAsc.slice(0, 5),
      noExam,
    };
  }, [data]);

  // Remarks
  const remarksSections = useMemo(() => {
    if (!data) return [];
    const sections = [];

    const noExamSubjects = topWorstSubjects.noExam.map((s) => s.subject_name);
    const failing = [];
    const satisfactory = [];
    const excellent = [];
    const errors = [];

    Object.values(data.examTypes).forEach((subjects) =>
      subjects.forEach((s) => {
        if (s.score == null) return;
        const color = computeGradeColor(s.score, s.items, criteria);
        if (color === "red") failing.push(s.subject_name);
        else if (color === "yellow") satisfactory.push(s.subject_name);
        else if (["green", "white"].includes(color))
          excellent.push(s.subject_name);
        else if (color === "black") errors.push(s.subject_name);
      })
    );

    if (noExamSubjects.length)
      sections.push({ title: "No Exam Recorded", content: noExamSubjects });
    if (failing.length)
      sections.push({ title: "Needs Improvement", content: failing });
    if (satisfactory.length)
      sections.push({
        title: "Satisfactory Performance",
        content: satisfactory,
      });
    if (excellent.length)
      sections.push({ title: "Excellent Performance", content: excellent });
    if (errors.length)
      sections.push({ title: "Input Errors", content: errors });
    if (!sections.length)
      sections.push({
        title: "Average Performance",
        content: ["Performance is average."],
      });

    return sections;
  }, [data, criteria, topWorstSubjects]);

  if (error)
    return <Typography color="error">{JSON.stringify(error)}</Typography>;
  if (!data) return <Typography>Loading...</Typography>;

  return (
    <Box p={3} sx={{ bgcolor: "white" }}>
      <Button
        variant="outlined"
        onClick={() => navigate("/view-grades")}
        sx={{ mb: 2 }}
      >
        &larr; Back
      </Button>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Divider sx={{ flexGrow: 1, height: 2, bgcolor: "primary.light" }} />
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ color: "primary.main", textTransform: "uppercase", mx: 2 }}
          >
            Student Report
          </Typography>
          <Divider sx={{ flexGrow: 1, height: 2, bgcolor: "primary.light" }} />
        </Box>

        {/* Info */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
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
      </Box>

      <Box display="flex" gap={3}>
        {/* Exam Tables */}
        <Box
          sx={{ width: 350, display: "flex", flexDirection: "column", gap: 3 }}
        >
          {Object.entries(data.examTypes).map(([examType, subjects]) => {
            const totalScore = subjects.reduce(
              (s, sub) => s + (sub.score ?? 0),
              0
            );
            const totalItems = subjects.reduce(
              (s, sub) => s + (sub.items ?? 0),
              0
            );

            return (
              <ReportBox key={examType}>
                <Typography variant="h6">{examType}</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
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
                      {subjects.map((subj, i) => {
                        const color =
                          subj.score == null
                            ? "blue"
                            : computeGradeColor(
                                subj.score,
                                subj.items,
                                criteria
                              );
                        const percentage =
                          subj.score != null && subj.items
                            ? ((subj.score / subj.items) * 100).toFixed(1)
                            : null;

                        return (
                          <TableRow key={i}>
                            <TableCell>{subj.subject_name}</TableCell>
                            <TableCell sx={getCellStyle(color)}>
                              {subj.score != null
                                ? `${subj.score}/${subj.items}`
                                : "NO EXAM"}
                            </TableCell>
                            <TableCell sx={getCellStyle(color)}>
                              {percentage ? `${percentage}%` : "-"}
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
                          const percentage = (
                            (totalScore / totalItems) *
                            100
                          ).toFixed(1);
                          return (
                            <TableRow>
                              <TableCell>
                                <b>Total</b>
                              </TableCell>
                              <TableCell sx={getCellStyle(totalColor)}>
                                <b>
                                  {totalScore}/{totalItems}
                                </b>
                              </TableCell>
                              <TableCell sx={getCellStyle(totalColor)}>
                                <b>{percentage}%</b>
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

        {/* Right Column */}
        <Box flex={1} display="flex" flexDirection="column" gap={3}>
          <Box display="flex" gap={2}>
            {/* Top 5 High / Low */}
            {["top", "worst"].map((key) => (
              <ReportBox flex={1} key={key}>
                <Typography variant="h6" gutterBottom>
                  Top 5 {key === "top" ? "Highest" : "Lowest"}-Scoring Subjects
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
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
                      {topWorstSubjects[key].map((subj) => {
                        const color = computeGradeColor(
                          subj.score,
                          subj.items,
                          criteria
                        );
                        return (
                          <TableRow
                            key={subj.subject_id}
                            sx={getCellStyle(color)}
                          >
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
            ))}
          </Box>

          {/* Pie + Recommendations */}
          <Box display="flex" gap={2}>
            <ReportBox>
              <Typography variant="h6" gutterBottom>
                Flags Summary
              </Typography>
              <PieArcChart
                data={[
                  {
                    label: "Excellent",
                    value: flagCounts.white ?? 0,
                    color: getChartColor("white"),
                  },
                  {
                    label: "Passed",
                    value: flagCounts.green ?? 0,
                    color: getChartColor("green"),
                  },
                  {
                    label: "Satisfactory",
                    value: flagCounts.yellow ?? 0,
                    color: getChartColor("yellow"),
                  },
                  {
                    label: "Failed",
                    value: flagCounts.red ?? 0,
                    color: getChartColor("red"),
                  },
                  {
                    label: "No Exam",
                    value: flagCounts.blue ?? 0,
                    color: getChartColor("blue"),
                  },
                  {
                    label: "Input Error",
                    value: flagCounts.black ?? 0,
                    color: getChartColor("black"),
                  },
                ]}
                width={200}
                height={200}
              />
            </ReportBox>

            <ReportBox flex={1}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "white",
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {recommendations.map((rec, i) => {
                  const isAlert = rec.toLowerCase().includes("alert");
                  const style = getRecommendationStyle(isAlert);
                  return (
                    <Paper
                      key={i}
                      sx={{
                        p: 2,
                        bgcolor: style.backgroundColor,
                        borderLeft: style.borderLeft,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: style.textColor }}
                      >
                        {rec}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </ReportBox>
          </Box>

          {/* Remarks */}
          <ReportBox>
            <Typography variant="h6" gutterBottom>
              Remarks
            </Typography>
            <Box
              sx={{
                bgcolor: "white",
                p: 2,
                borderRadius: 2,
                border: "1px solid #ccc",
              }}
            >
              {remarksSections.map((sec, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  {i > 0 && <Divider sx={{ my: 1 }} />}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "text.primary" }}
                  >
                    {sec.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: "text.primary" }}
                  >
                    {sec.content.join(", ")}
                  </Typography>
                </Box>
              ))}
            </Box>
          </ReportBox>
        </Box>
      </Box>
    </Box>
  );
}
