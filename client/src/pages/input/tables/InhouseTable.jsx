import { useState, useMemo, useRef, useEffect } from "react";
import { Box } from "@mui/material";

import AgBaseGrid from "../../../components/tables/input/AgBaseGrid";

import AddExamForm from "../../../components/forms/AddExamForm";
import UpdateExamForm from "../../../components/forms/UpdateExamForm";
import ArchiveExamForm from "../../../components/forms/ArchiveExamForm";

import SuccessSnackbar from "../../../components/alerts/SuccessSnackbar";
import ErrorSnackbar from "../../../components/alerts/ErrorSnackbar";
import useSnackbar from "../../../hooks/useSnackbar";
import useStudentGrades from "../../../hooks/useStudentGrades";
import VerticalTabs from "../../../components/layout/VerticalTabs";

import { getExamTypes } from "../../../utils/examTypes";

export default function InhouseTable({ universityId }) {
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [openArchiveForm, setOpenArchiveForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const gridRef = useRef();
  const errorSnackbar = useSnackbar();
  const successSnackbar = useSnackbar();

  const examTypes = getExamTypes("Inhouse");
  const inhouse = useStudentGrades("Inhouse", universityId);

  // Warn before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleSave = async (filteredSubjects, inhouseRows) => {
    if (gridRef.current) gridRef.current.api.stopEditing();

    // Check for validation errors
    const rowsWithErrors = inhouseRows.filter(
      (row) =>
        row.invalidFields &&
        Object.values(row.invalidFields).some((err) => !!err)
    );

    if (rowsWithErrors.length) {
      const firstErrorRow = rowsWithErrors[0];
      const errorFields = Object.keys(firstErrorRow.invalidFields).filter(
        (f) => firstErrorRow.invalidFields[f]
      );
      errorSnackbar.show(
        `Cannot save: Errors in columns: ${errorFields.join(", ")}`
      );
      return;
    }

    // Use score_${score_id} instead of subject_name
    const payload = inhouseRows.flatMap((row) =>
      filteredSubjects.map((subj) => {
        const val = row[`score_${subj.score_id}`];
        const score =
          val === "" || val === null || val === "NO EXAM" ? null : Number(val);
        return {
          student_id: row.id,
          score_id: subj.score_id,
          score,
        };
      })
    );

    if (!payload.length) {
      successSnackbar.show("Nothing to save.");
      return;
    }

    try {
      await inhouse.saveGrades(payload);
      successSnackbar.show("Grades saved!");
      setUnsavedChanges(false);
      inhouse.refetch();
    } catch (err) {
      console.error(err);
      errorSnackbar.show("Failed to save grades.");
    }
  };

  return (
    <VerticalTabs tabs={examTypes}>
      {examTypes.map((examType) => {
        const filteredSubjects = useMemo(
          () =>
            (inhouse.raw.subjects || []).filter(
              (subj) => subj.exam_type === examType
            ),
          [inhouse.raw.subjects, examType]
        );

        const inhouseRows = inhouse.rows;

        // Updated columns use score_${subj.score_id}
        const columnDefs = useMemo(
          () => [
            {
              field: "studentName",
              headerName: "Student Name",
              width: 250,
              pinned: "left",
              lockPosition: true,
            },
            ...filteredSubjects.map((subj) => ({
              field: `score_${subj.score_id}`,
              headerName: `${subj.subject_name} (${subj.items ?? ""})`,
              width: 150,
              editable: true,
              cellEditor: "agTextCellEditor",
              cellEditorParams: { preventStepping: true },
              suppressMovable: true,
              cellClassRules: {
                "exceed-limit": (params) =>
                  Number(params.value) > Number(subj.items),
                "below-zero": (params) => 0 > Number(params.value),
              },
              valueFormatter: (params) =>
                params.value === "" || params.value === null
                  ? "NO EXAM"
                  : params.value,
            })),
          ],
          [filteredSubjects]
        );

        const handleAdd = () => setOpenAddForm(true);
        const handleEdit = () => {
          setOpenUpdateForm(true);
          setSelectedExam(
            inhouseRows.find((r) => r.selected) || inhouseRows[0]
          );
        };
        const handleArchive = () => setOpenArchiveForm(true);

        return (
          <Box
            key={examType}
            display="flex"
            flexDirection="column"
            gap={2}
            height="100%"
          >
            <AgBaseGrid
              ref={gridRef}
              rowData={inhouseRows}
              columnDefs={columnDefs}
              filteredSubjects={filteredSubjects}
              criteriaValues={[]}
              tableName="Inhouse"
              setRows={(updatedRows) => {
                if (gridRef.current) gridRef.current.api.stopEditing();

                // Validation updated to use score_${id}
                updatedRows.forEach((row) => {
                  filteredSubjects.forEach((subj) => {
                    const value = row[`score_${subj.score_id}`];
                    const max = subj.items;
                    if (!row.invalidFields) row.invalidFields = {};
                    row.invalidFields[`score_${subj.score_id}`] =
                      value !== "NO EXAM" &&
                      (isNaN(value) || value < 0 || (max && value > max))
                        ? "Invalid grade"
                        : null;
                  });
                });

                inhouse.setRows(updatedRows);
                setUnsavedChanges(true);
              }}
              onSaveClick={() => handleSave(filteredSubjects, inhouseRows)}
              saveDisabled={!unsavedChanges}
              onAddClick={handleAdd}
              onEditClick={handleEdit}
              onArchiveClick={() =>
                handleArchive(
                  inhouseRows.find((r) => r.selected) || inhouseRows[0]
                )
              }
            />

            <AddExamForm
              open={openAddForm}
              onClose={() => setOpenAddForm(false)}
              onSuccess={() => inhouse.refetch()}
              examType={examType}
              mode="Inhouse"
              universityId={universityId}
            />
            <UpdateExamForm
              open={openUpdateForm}
              onClose={() => setOpenUpdateForm(false)}
              onSuccess={() => inhouse.refetch()}
              examType={examType}
              mode="Inhouse"
              universityId={universityId}
            />
            <ArchiveExamForm
              open={openArchiveForm}
              onClose={() => setOpenArchiveForm(false)}
              onSuccess={() => inhouse.refetch()}
              scoreId={selectedExam?._score_id}
              examType={examType}
              mode="Inhouse"
              universityId={universityId}
            />

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
          </Box>
        );
      })}
    </VerticalTabs>
  );
}
