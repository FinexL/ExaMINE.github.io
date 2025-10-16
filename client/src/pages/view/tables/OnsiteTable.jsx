import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import VerticalTabs from "../../../components/layout/VerticalTabs";
import useStudentGrades from "../../../hooks/useStudentGrades";
import AgBaseGrid from "../components/AgBaseGrid";
import CriteriaForm from "../components/forms/CriteriaForm";
import ExportForm from "../components/forms/ExportForm";
import useGradeCriteria from "../../../hooks/useGradeCriteria";
import { getExamTypes } from "../../../utils/examTypes";

export default function OnsiteTable({ mode = "Onsite", universityId }) {
  const examTypes = getExamTypes("Onsite");
  const studentGrades = useStudentGrades(mode, universityId);
  const { criteria, error } = useGradeCriteria(mode);

  const [exportOpen, setExportOpen] = useState(false);
  const [criteriaValues, setCriteriaValues] = useState(criteria);

  useEffect(() => {
    setCriteriaValues(criteria);
  }, [criteria]);

  const handleSaveCriteria = (newValues) => setCriteriaValues(newValues);

  return (
    <VerticalTabs tabs={examTypes}>
      {examTypes.map((examType) => {
        // Filter subjects for this exam type
        const filteredSubjects = useMemo(
          () =>
            (studentGrades.raw.subjects || []).filter(
              (subj) => subj.exam_type === examType
            ),
          [studentGrades.raw.subjects, examType]
        );

        const rows = studentGrades.rows;

        //  Build columns using score_id-based keys
        const columnDefs = useMemo(
          () => [
            {
              field: "studentName",
              headerName: "Student Name",
              width: 250,
              pinned: "left",
              lockPosition: true,
              cellRenderer: (params) => (
                <Link
                  to={`/view-grades/${params.data.student_id}`}
                  style={{
                    color: "black",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {params.value}
                </Link>
              ),
            },
            {
              field: "university_name",
              headerName: "School",
              width: 180,
              pinned: "left",
              lockPosition: true,
            },
            //
            ...filteredSubjects.map((subj) => ({
              field: `score_${subj.score_id}`,
              headerName: `${subj.subject_name} (${subj.items ?? ""})`,
              width: 150,
              suppressMovable: true,
              valueFormatter: (params) =>
                params.value === "" || params.value === null
                  ? "NO EXAM"
                  : params.value,
            })),
          ],
          [filteredSubjects]
        );

        return (
          <Box
            key={examType}
            display="flex"
            flexDirection="column"
            gap={2}
            height="100%"
          >
            {/* AG Grid with updated score fields */}
            <AgBaseGrid
              rowData={rows}
              columnDefs={columnDefs}
              filteredSubjects={filteredSubjects}
              mode={mode}
              criteriaValues={criteriaValues}
              examTerms={examTypes}
              onExportClick={() => setExportOpen(true)}
            />

            {/* Updated Export Form */}
            <ExportForm
              open={exportOpen}
              onClose={() => setExportOpen(false)}
              mode={mode}
              examTerms={examTypes}
              filteredSubjects={studentGrades.raw.subjects || []}
              criteriaValues={criteriaValues}
              rows={rows}
            />

            {/* Criteria Form */}
            <CriteriaForm
              open={false}
              mode={mode}
              onClose={() => {}}
              onSave={handleSaveCriteria}
            />

            {error && <Box color="red">Error fetching criteria: {error}</Box>}
          </Box>
        );
      })}
    </VerticalTabs>
  );
}
