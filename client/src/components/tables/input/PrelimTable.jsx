// src/components/tables/input/PrelimTable.jsx
import { useState, useMemo } from "react";
import { Box } from "@mui/material";
import BaseDataGrid from "./BaseDataGrid";

import ExamForm from "../../forms/ExamForm";
import SuccessSnackbar from "../../alerts/SuccessSnackbar";
import ErrorSnackbar from "../../alerts/ErrorSnackbar";

import useStudentGrades from "../../../hooks/useStudentGrades";

export default function PrelimTable() {
  const [openForm, setOpenForm] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const prelim = useStudentGrades("Prelim");

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  const columnDefs = useMemo(
    () =>
      prelim.columns.map((col) => ({
        headerName: col.headerName,
        field: col.field,
        editable: col.editable ?? false,
        width: col.width,
        pinned: col.field === "studentName" ? "left" : undefined,
        type: col.type === "number" ? "numericColumn" : undefined,
      })),
    [prelim.columns]
  );

  const handleSave = async () => {
    const payload = prelim.rows.flatMap((row) =>
      prelim.raw.subjects.map((subj) => {
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
      await prelim.saveGrades(payload);
      setSnackbarMessage("Grades saved!");
      setSuccessOpen(true);
      setUnsavedChanges(false);
      prelim.refetch();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to save grades.");
      setErrorOpen(true);
    }
  };

  return (
    <Box display="flex" gap={2} flexDirection="column" height="100%">
      <BaseDataGrid
        rowData={prelim.rows}
        columnDefs={columnDefs}
        raw={prelim.raw}
        setRows={(updatedRows) => {
          prelim.setRows(updatedRows);
          setUnsavedChanges(true);
        }}
        onAddClick={handleOpenForm}
        onSaveClick={handleSave}
        saveDisabled={!unsavedChanges}
        toolbarButtonLabel="Add Exam"
      />

      <ExamForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={() => {
          setOpenForm(false);
          prelim.refetch();
        }}
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
}
