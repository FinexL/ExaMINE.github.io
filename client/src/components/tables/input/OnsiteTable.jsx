// src/components/tables/input/OnsiteTable.jsx
import { useState, useMemo } from "react";
import { Box } from "@mui/material";
import BaseDataGrid from "./BaseDataGrid";

import ExamForm from "../../forms/ExamForm";
import SuccessSnackbar from "../../alerts/SuccessSnackbar";
import ErrorSnackbar from "../../alerts/ErrorSnackbar";

import useStudentGrades from "../../../hooks/useStudentGrades";
import VerticalTabs from "../../navigations/VerticalTabs";

export default function OnsiteTable({ universityId }) {
  const [openForm, setOpenForm] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const examTypes = ["Post Test", "Preboard 1", "Final Preboard"];
  const onsite = useStudentGrades("Onsite");

  const handleSave = async (filteredSubjects, onsiteRows) => {
    const payload = onsiteRows.flatMap((row) =>
      filteredSubjects.map((subj) => {
        const val = row[subj.subject_name];
        const score = val === "NO EXAM" ? null : Number(val);
        const passingScore = subj.items * 0.5;

        return {
          student_id: row.id,
          score_id: row[`_score_id_${subj.subject_name}`],
          score,
          grade_status:
            score === null ? 0 : score >= passingScore ? "Pass" : "Fail",
        };
      })
    );

    if (!payload.length) {
      setSnackbarMessage("Nothing to save.");
      setErrorOpen(true);
      return;
    }

    try {
      await onsite.saveGrades(payload);
      setSnackbarMessage("Grades saved!");
      setSuccessOpen(true);
      setUnsavedChanges(false);
      onsite.refetch();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to save grades.");
      setErrorOpen(true);
    }
  };

  return (
    <VerticalTabs tabs={examTypes}>
      {examTypes.map((examType) => {
        const filteredSubjects = useMemo(
          () =>
            onsite.raw.subjects.filter((subj) => subj.exam_type === examType),
          [onsite.raw.subjects, examType]
        );

        const onsiteRows = useMemo(
          () =>
            onsite.rows.map((row) => {
              const newRow = { id: row.id, studentName: row.studentName };

              filteredSubjects.forEach((subj) => {
                newRow[subj.subject_name] = row[subj.subject_name] ?? "";
                newRow[`_score_id_${subj.subject_name}`] =
                  row[`_score_id_${subj.subject_name}`] ?? null;
              });

              return newRow;
            }),
          [onsite.rows, filteredSubjects]
        );

        const columnDefs = useMemo(
          () => [
            {
              field: "studentName",
              headerName: "Student Name",
              width: 250,
              pinned: "left",
            },
            ...filteredSubjects.map((subj) => ({
              field: subj.subject_name,
              headerName: `${subj.subject_name} (${subj.items ?? ""})`,
              width: 150,
              editable: true,
              type: "number",
            })),
          ],
          [filteredSubjects]
        );

        return (
          <Box
            key={examType}
            display="flex"
            gap={2}
            flexDirection="column"
            height="100%"
          >
            <BaseDataGrid
              rowData={onsiteRows}
              columnDefs={columnDefs}
              raw={onsite.raw}
              setRows={(updatedRows) => {
                onsite.setRows(updatedRows);
                setUnsavedChanges(true);
              }}
              onSaveClick={() => handleSave(filteredSubjects, onsiteRows)}
              saveDisabled={!unsavedChanges}
              toolbarButtonLabel="Add Exam"
              onAddClick={() => setOpenForm(true)}
            />

            <ExamForm
              open={openForm}
              onClose={() => setOpenForm(false)}
              onSuccess={() => refetchData()}
              examType={examType}
              mode="Onsite"
              universityId={universityId}
            />

            <SuccessSnackbar
              open={successOpen}
              message={snackbarMessage}
              onClose={() => setSuccessOpen(false)}
            />
            <ErrorSnackbar
              open={errorOpen}
              message={snackbarMessage}
              onClose={() => setErrorOpen(false)}
            />
          </Box>
        );
      })}
    </VerticalTabs>
  );
}
