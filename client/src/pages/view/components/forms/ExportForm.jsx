import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
  Checkbox,
  FormGroup,
} from "@mui/material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { applyGradeColors } from "./applyGradeColors";
import SuccessSnackbar from "../../../../components/alerts/SuccessSnackbar";
import ErrorSnackbar from "../../../../components/alerts/ErrorSnackbar";
import useSnackbar from "../../../../hooks/useSnackbar";
export default function ExportForm({
  open,
  onClose,
  mode,
  examTerms = [],
  filteredSubjects = [],
  criteriaValues,
  rows = [],
}) {
  // Add "All Exams" option
  const allExamTerms = ["All Exams", ...examTerms];

  const [examType, setExamType] = useState(allExamTerms[0]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [includeCriteria, setIncludeCriteria] = useState(true);
  const successSnackbar = useSnackbar();
  const errorSnackbar = useSnackbar();

  const [sortByRank, setSortByRank] = useState(false);

  const allSchools = Array.from(new Set(rows.map((r) => r.university_name)));
  const [schoolOption, setSchoolOption] = useState("all_in_one");
  const [selectedSchools, setSelectedSchools] = useState([]);
  const handleSchoolChange = (event) => {
    const { value } = event.target;
    setSelectedSchools(typeof value === "string" ? value.split(",") : value);
  };

  useEffect(() => {
    if (open) setExamType("All Exams");
  }, [open]);

  const allSubjects = Array.from(
    new Map(
      filteredSubjects.map((s) => [`${s.subject_name}_${s.exam_type}`, s])
    ).values()
  );

  const subjectsForExam =
    examType === "All Exams"
      ? allSubjects
      : filteredSubjects.filter((s) => s.exam_type === examType);

  const handleExamTypeChange = (e) => {
    const selectedType = e.target.value;
    setExamType(selectedType);
    // Reset subject selection when exam type changes
    setSelectedSubjects([]);
  };

  const handleSubjectChange = (event) => {
    const value = event.target.value;
    if (value.includes("Select All")) {
      // Toggle select all
      if (selectedSubjects.length === subjectsForExam.length) {
        setSelectedSubjects([]);
      } else {
        setSelectedSubjects(subjectsForExam.map((s) => s.subject_name));
      }
    } else {
      setSelectedSubjects(value);
    }
  };

  // ExcelJS Export Handler

  const handleExport = async () => {
    // Validate specific schools selection
    if (schoolOption === "specific_schools" && selectedSchools.length === 0) {
      errorSnackbar.show("Please select at least one school to export.");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();

      // Helper to get schools to export based on option
      const schoolsToExport =
        schoolOption === "all_in_one"
          ? ["All Schools"]
          : schoolOption === "all_separate_sheets"
          ? allSchools
          : selectedSchools;

      // Loop through each school
      for (const school of schoolsToExport) {
        const schoolRows =
          school === "All Schools"
            ? rows
            : rows.filter((r) => r.university_name === school);

        // ✅ Only create Overview if "All Exams" is selected
        if (examType === "All Exams") {
          const sheetName =
            school === "All Schools" ? "Overview" : `${school} - Overview`;
          const overviewSheet = workbook.addWorksheet(sheetName);

          // --- Header ---
          overviewSheet.mergeCells("C1", "H1");
          const titleCell = overviewSheet.getCell("C1");
          titleCell.value =
            school === "All Schools"
              ? `${mode} - All Schools Grades Overview`
              : `${mode} - ${school} Grades Overview`;
          titleCell.font = { size: 16, bold: true };
          titleCell.alignment = { horizontal: "center" };

          overviewSheet.mergeCells("C2", "H2");
          overviewSheet.getCell(
            "C2"
          ).value = `Generated on: ${new Date().toLocaleString()}`;
          overviewSheet.getCell("C2").alignment = { horizontal: "center" };
          overviewSheet.addRow([]);

          // --- Add column headers ---
          const headerRow = overviewSheet.addRow([
            "Student Name",
            "University",
            ...examTerms,
            "Total",
            "Percentage",
          ]);
          const overviewCols = [
            { header: "Student Name", width: 25 },
            { header: "University", width: 20 },
            ...examTerms.map(() => ({ width: 15 })),
            { header: "Total", width: 15 },
            { header: "Percentage", width: 15 },
          ];
          overviewCols.forEach((col, i) => {
            overviewSheet.getColumn(i + 1).width = col.width;
          });
          if (examType === "All Exams" && includeCriteria && criteriaValues) {
            const scoreCols = examTerms.map((_, i) => i + 3); // columns C onwards
            applyGradeColors(
              overviewSheet,
              criteriaValues,
              4,
              overviewSheet.rowCount,
              scoreCols
            );
          }

          // Style header row
          headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFD9EAD3" },
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });

          // --- Add data rows ---
          schoolRows.forEach((row) => {
            const examScores = examTerms.map((term) => {
              const subjects = filteredSubjects.filter(
                (s) => s.exam_type === term
              );
              const total = subjects.reduce(
                (acc, subj) =>
                  acc + (Number(row[`score_${subj.score_id}`]) || 0),
                0
              );
              const max = subjects.reduce(
                (acc, subj) => acc + (Number(subj.items) || 0),
                0
              );
              return max > 0 ? `${total}/${max}` : "NO EXAM";
            });

            const overallTotal = examTerms.reduce((acc, term) => {
              const subjects = filteredSubjects.filter(
                (s) => s.exam_type === term
              );
              return (
                acc +
                subjects.reduce(
                  (a, s) => a + (Number(row[`score_${s.score_id}`]) || 0),
                  0
                )
              );
            }, 0);

            const overallMax = filteredSubjects.reduce(
              (a, s) => a + (Number(s.items) || 0),
              0
            );
            const percentage =
              overallMax > 0
                ? ((overallTotal / overallMax) * 100).toFixed(2) + "%"
                : "0%";

            const dataRow = overviewSheet.addRow([
              row.studentName,
              row.university_name,
              ...examScores,
              `${overallTotal}/${overallMax}`,
              percentage,
            ]);

            // Style each data row
            dataRow.eachCell((cell) => {
              cell.alignment = { horizontal: "center", vertical: "middle" };
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
          });

          // Freeze header row
          overviewSheet.views = [
            {
              state: "frozen",
              ySplit: 3,
              topLeftCell: "A4",
              activeCell: "A1",
            },
          ];
        }

        // ✅ Keep per-term sheets (always generated)
        const termsToExport = examType === "All Exams" ? examTerms : [examType];
        for (const term of termsToExport) {
          let termSubjects = filteredSubjects.filter(
            (s) => s.exam_type === term
          );

          // 🧩 If user selected specific subjects, filter them too
          if (examType !== "All Exams" && selectedSubjects.length > 0) {
            termSubjects = termSubjects.filter((s) =>
              selectedSubjects.includes(s.subject_name)
            );
          }

          if (!termSubjects.length) continue;

          const termSheetName =
            school === "All Schools" ? term : `${school} - ${term}`;
          const examSheet = workbook.addWorksheet(termSheetName);

          examSheet.mergeCells("C1", "H1");
          examSheet.getCell("C1").value = `${term} Exam Report - ${
            school || mode
          }`;

          examSheet.getCell("C1").font = { size: 14, bold: true };
          examSheet.getCell("C1").alignment = { horizontal: "center" };
          examSheet.addRow([]);

          const termCols = [
            { header: "Student Name", key: "studentName", width: 25 },
            { header: "School", key: "university_name", width: 20 },
            ...termSubjects.map((s) => ({
              header: `${s.subject_name} (${s.items})`,
              key: `score_${s.score_id}`,
              width: 15,
            })),
            { header: "Total Score", key: "totalScore", width: 15 },
            { header: "Percentage", key: "percentage", width: 15 },
          ];

          termCols.forEach((col, i) => {
            examSheet.getColumn(i + 1).width = col.width;
          });

          const termHeaderRow = examSheet.getRow(3);
          termCols.forEach((col, i) => {
            termHeaderRow.getCell(i + 1).value = col.header;
          });

          if (termSubjects.length > 0) {
            const startCol = 3;
            const endCol = 2 + termSubjects.length;
            examSheet.mergeCells(2, startCol, 2, endCol);
            const termHeader = examSheet.getCell(2, startCol);
            termHeader.value = term;
            termHeader.alignment = { horizontal: "center" };
            termHeader.font = { bold: true };
          }

          schoolRows.forEach((row) => {
            const total = termSubjects.reduce((acc, subj) => {
              const val = Number(row[`score_${subj.score_id}`]) || 0;
              return acc + val;
            }, 0);
            const maxTotal = termSubjects.reduce(
              (acc, subj) => acc + (Number(subj.items) || 0),
              0
            );
            const percentage =
              maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) + "%" : "0%";

            const rowValues = [
              row.studentName,
              row.university_name,
              ...termSubjects.map((subj) => {
                const score = row[`score_${subj.score_id}`];
                if (typeof score === "number") return `${score}/${subj.items}`;
                return "NO EXAM";
              }),
              `${total} / ${maxTotal}`,
              percentage,
            ];

            examSheet.addRow(rowValues);
          });
          if (includeCriteria && criteriaValues) {
            // Determine which columns to color (score columns)
            const startCol = 3; // first subject column
            const endCol = 2 + termSubjects.length; // last subject column
            const scoreCols = [];
            for (let c = startCol; c <= endCol; c++) scoreCols.push(c);

            applyGradeColors(
              examSheet,
              criteriaValues,
              4,
              examSheet.rowCount,
              scoreCols
            );
          }
          // --- Freeze for per-term sheet ---
          examSheet.views = [
            {
              state: "frozen",
              xSplit: 2,
              ySplit: 3,
              topLeftCell: "C4",
              activeCell: "A1",
            },
          ];

          // Style per-term sheet
          examSheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
              cell.alignment = { horizontal: "center", vertical: "middle" };
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
            if (rowNumber === 3) {
              row.font = { bold: true };
              row.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD9EAD3" },
              };
            }
          });
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer]),
        `${mode}_${examType.replace(/\s+/g, "_")}_Grades_${Date.now()}.xlsx`
      );
      onClose();
      successSnackbar.show("Export completed successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      errorSnackbar.show("Export failed. See console for details.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Export Settings</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Exam Term
              </Typography>
              <RadioGroup row value={examType} onChange={handleExamTypeChange}>
                {allExamTerms.map((term) => (
                  <FormControlLabel
                    key={term}
                    value={term}
                    control={<Radio />}
                    label={term}
                  />
                ))}
              </RadioGroup>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                School Filter
              </Typography>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Radio
                      checked={schoolOption === "all_in_one"}
                      onChange={() => setSchoolOption("all_in_one")}
                    />
                  }
                  label="All Schools in One Sheet"
                />
                {/*
              <FormControlLabel
                control={
                  <Radio
                    checked={schoolOption === "all_separate_sheets"}
                    onChange={() => setSchoolOption("all_separate_sheets")}
                  />
                }
                label="All Schools in Separate Sheets"
              />*/}
                <FormControlLabel
                  control={
                    <Radio
                      checked={schoolOption === "specific_schools"}
                      onChange={() => setSchoolOption("specific_schools")}
                    />
                  }
                  label="Select Specific Schools"
                />

                {schoolOption === "specific_schools" && (
                  <Select
                    multiple
                    fullWidth
                    size="small"
                    value={selectedSchools}
                    onChange={handleSchoolChange}
                    input={<OutlinedInput label="Schools" />}
                    renderValue={(selected) => selected.join(", ")}
                    sx={{ mt: 1 }}
                  >
                    {allSchools.map((school) => (
                      <MenuItem key={school} value={school}>
                        <Checkbox checked={selectedSchools.includes(school)} />
                        <ListItemText primary={school} />
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormGroup>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Exam
              </Typography>

              {examType === "All Exams" ? (
                <Typography color="text.secondary" sx={{ mt: 1, ml: 1 }}>
                  Exam selection is disabled when "All Exams" is selected.
                </Typography>
              ) : (
                <Select
                  multiple
                  fullWidth
                  size="small"
                  value={selectedSubjects}
                  onChange={handleSubjectChange}
                  input={<OutlinedInput label="Subjects" />}
                  renderValue={(selected) =>
                    selected.length === subjectsForExam.length
                      ? "All Subjects"
                      : selected.join(", ")
                  }
                >
                  <MenuItem value="Select All">
                    <Checkbox
                      checked={
                        selectedSubjects.length === subjectsForExam.length &&
                        subjectsForExam.length > 0
                      }
                      indeterminate={
                        selectedSubjects.length > 0 &&
                        selectedSubjects.length < subjectsForExam.length
                      }
                    />
                    <ListItemText primary="Select All Subjects" />
                  </MenuItem>

                  {subjectsForExam.map((subj) => (
                    <MenuItem key={subj.subject_id} value={subj.subject_name}>
                      <Checkbox
                        checked={selectedSubjects.includes(subj.subject_name)}
                      />
                      <ListItemText primary={subj.subject_name} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Options
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeCriteria}
                      onChange={(e) => setIncludeCriteria(e.target.checked)}
                    />
                  }
                  label="Include grading criteria"
                />
              </FormGroup>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={!rows.length}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
      <SuccessSnackbar
        open={successSnackbar.open}
        message={successSnackbar.message}
        onClose={successSnackbar.close}
      />
      <ErrorSnackbar
        open={errorSnackbar.open}
        message={errorSnackbar.message}
        onClose={errorSnackbar.close}
      />
    </>
  );
}
