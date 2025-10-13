import { useRef, useState, useMemo } from "react";
import { Box } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import CriteriaForm from "./forms/CriteriaForm";
import { computeGradeColor } from "../../../utils/computeGradeColor";
import {
  calculateTotalScore,
  calculatePercentage,
} from "../../../utils/calculateTotalScore";
import ViewGradeToolbar from "./toolbars/viewGradeToolbar";

import "ag-grid-community/styles/ag-theme-quartz.css";

export default function AgBaseGrid({
  rowData,
  columnDefs,
  defaultColDef = {},
  filteredSubjects = [],
  mode,
  examTerms,
  criteriaValues,
  onExportClick, // 👈 new prop
}) {
  const gridRef = useRef();
  const [criteriaDialogOpen, setCriteriaDialogOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");

  const defaultColumnDefsMemo = useMemo(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      editable: false, // read-only, change to true if needed
      cellStyle: { textAlign: "center", paddingTop: 2, paddingBottom: 2 },
      ...defaultColDef,
    }),
    [defaultColDef]
  );
  const handleRefresh = () => {
    if (gridRef.current) {
      gridRef.current.api.refreshCells({ force: true });
      gridRef.current.api.redrawRows();
    }
  };

  // Style and value formatting for columns
  const styledColumnDefs = useMemo(() => {
    const subjectCols = columnDefs.map((col) => {
      if (!["studentName", "university_name"].includes(col.field)) {
        const match = col.field.match(/^score_(\d+)$/);
        const scoreId = match ? Number(match[1]) : null;

        const subject = filteredSubjects.find((s) => s.score_id === scoreId);
        const maxItems = subject?.items ?? 100;

        return {
          ...col,
          valueGetter: (params) => {
            const score = params.data[col.field];
            return typeof score === "number"
              ? `${score} / ${maxItems}`
              : "NO EXAM";
          },

          valueFormatter: (params) => params.value, // just show the same string
          cellStyle: (params) => {
            const score = params.data[col.field];

            // If score is NOT a number → show blue
            if (typeof score !== "number") {
              return {
                textAlign: "center",
                paddingTop: 2,
                paddingBottom: 2,
                backgroundColor: "#bbdefb", // blue
                color: "#000",
              };
            }

            // Otherwise, compute color normally
            const color = computeGradeColor(score, maxItems, criteriaValues);

            return {
              textAlign: "center",
              paddingTop: 2,
              paddingBottom: 2,
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
                  ? "#000"
                  : "#fff",
              color: color === "black" ? "#fff" : undefined,
            };
          },
        };
      }
      return col;
    });

    const totalScoreCol = {
      field: "totalScore",
      headerName: "Total Score",
      width: 180,
      valueGetter: (params) => {
        // Use all subjects, not affected by search
        const { total } = calculateTotalScore(params.data, filteredSubjects);
        return total;
      },
      valueFormatter: (params) => {
        const { total, maxTotal } = calculateTotalScore(
          params.data,
          filteredSubjects
        );
        return `${total} / ${maxTotal}`;
      },
      cellStyle: (params) => {
        const { total, maxTotal } = calculateTotalScore(
          params.data,
          filteredSubjects
        );
        const color = computeGradeColor(total, maxTotal, criteriaValues);
        return {
          textAlign: "center",
          paddingTop: 2,
          paddingBottom: 2,
          fontWeight: "bold",
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
              ? "#000"
              : "#fff",
          color: color === "black" ? "#fff" : undefined,
        };
      },
    };

    const percentageCol = {
      field: "percentage",
      headerName: "Percentage",
      width: 150,
      valueGetter: (params) => {
        // Only include visible subjects based on headerSearch
        const visibleSubjects = filteredSubjects.filter((subj) => {
          const header = subj.subject_name.toLowerCase();
          return !headerSearch || header.includes(headerSearch.toLowerCase());
        });

        const { total, maxTotal } = calculateTotalScore(
          params.data,
          visibleSubjects
        );
        return calculatePercentage(total, maxTotal);
      },
      valueFormatter: (params) =>
        params.value != null ? `${params.value.toFixed(2)}%` : "0%",
      cellStyle: (params) => {
        const visibleSubjects = filteredSubjects.filter((subj) => {
          const header = subj.subject_name.toLowerCase();
          return !headerSearch || header.includes(headerSearch.toLowerCase());
        });

        const { total, maxTotal } = calculateTotalScore(
          params.data,
          visibleSubjects
        );
        const color = computeGradeColor(total, maxTotal, criteriaValues);

        return {
          textAlign: "center",
          paddingTop: 2,
          paddingBottom: 2,
          fontWeight: "bold",
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
              ? "#000"
              : "#fff",
          color: color === "black" ? "#fff" : undefined,
        };
      },
    };

    return [...subjectCols, totalScoreCol, percentageCol];
  }, [columnDefs, criteriaValues, filteredSubjects, headerSearch]);

  const filteredColumnDefs = useMemo(
    () =>
      styledColumnDefs.map((col) => {
        // Always keep these columns visible
        if (
          ["studentName", "university_name", "percentage"].includes(col.field)
        ) {
          return col;
        }

        if (!headerSearch) return { ...col, hide: false };

        const header = col.headerName || col.field;
        return header.toLowerCase().includes(headerSearch.toLowerCase())
          ? { ...col, hide: false }
          : { ...col, hide: true };
      }),
    [styledColumnDefs, headerSearch]
  );

  return (
    <Box>
      {/* Toolbar with search */}
      <ViewGradeToolbar
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        headerSearch={headerSearch}
        setHeaderSearch={setHeaderSearch}
        onCriteriaClick={() => setCriteriaDialogOpen(true)}
        onExportClick={onExportClick} // 👈 pass here
        filteredSubjects={filteredSubjects}
        criteriaValues={criteriaValues}
      />

      {/* AG Grid */}
      <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={filteredColumnDefs}
          defaultColDef={defaultColumnDefsMemo}
          rowHeight={30} // compact rows
          animateRows
          quickFilterText={quickFilter}
        />
      </div>

      {/* Criteria Dialog */}
      <CriteriaForm
        open={criteriaDialogOpen}
        onClose={() => setCriteriaDialogOpen(false)}
        onSave={() => {
          setCriteriaDialogOpen(false); // close dialog
          handleRefresh(); // refresh grid immediately
        }}
        mode={mode}
      />
    </Box>
  );
}
