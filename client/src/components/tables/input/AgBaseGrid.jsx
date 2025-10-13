import { useRef, useState, useMemo, forwardRef } from "react";
import { Box } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-quartz.css";
import InputGradeToolbar from "./toolbars/InputGradeToolbar";

const AgBaseGrid = forwardRef(
  (
    {
      rowData,
      columnDefs,
      filteredSubjects,
      setRows,
      onCellValueChanged,
      onAddClick,
      onSaveClick,
      onEditClick,
      onArchiveClick,
      onUndoClick,
      onRedoClick,
      onRowSelected,
      saveDisabled = true,
      toolbarButtonLabel = "Add Exam",
    },
    ref
  ) => {
    const gridRef = useRef();

    const [quickFilter, setQuickFilter] = useState("");
    const [headerSearch, setHeaderSearch] = useState("");

    const handleCellValueChanged = (params) => {
      const { colDef, newValue, data, api } = params;
      const field = colDef.field;

      if (field === "studentName" || field === "university_name") return;

      let value =
        newValue === "" || newValue === null ? "NO EXAM" : Number(newValue);

      const subject = filteredSubjects.find(
        (s) => s.subject_name === field || s.subject_id?.toString() === field
      );

      const max = subject?.items;
      let errorMsg = null;

      if (value !== "NO EXAM") {
        if (isNaN(value)) errorMsg = "Must be a number";
        else if (value < 0) errorMsg = "Cannot be negative";
        else if (max && value > max) errorMsg = `Exceeds max (${max})`;
      }

      if (!data.invalidFields) data.invalidFields = {};
      data.invalidFields[field] = errorMsg;

      data[field] = value;
      api.refreshCells({ rowNodes: [params.node], columns: [field] });

      setRows((prev) =>
        prev.map((r) =>
          r.id === data.id
            ? { ...r, [field]: value, invalidFields: { ...r.invalidFields } }
            : r
        )
      );
    };

    const filteredColumnDefs = useMemo(
      () =>
        columnDefs.map((col) => {
          if (col.field === "studentName" || col.field === "university_name")
            return col;
          if (!headerSearch) return { ...col, hide: false };
          const header = col.headerName || col.field;
          return header.toLowerCase().includes(headerSearch.toLowerCase())
            ? { ...col, hide: false }
            : { ...col, hide: true };
        }),
      [columnDefs, headerSearch]
    );

    const hasErrors = rowData.some(
      (row) =>
        row.invalidFields && Object.values(row.invalidFields).some(Boolean)
    );

    return (
      <Box
        width="100%"
        height="80vh"
        display="flex"
        flexDirection="column"
        gap={1}
      >
        <InputGradeToolbar
          onAddClick={onAddClick}
          onSaveClick={onSaveClick}
          onEditClick={onEditClick}
          onArchiveClick={onArchiveClick}
          onUndoClick={onUndoClick}
          onRedoClick={onRedoClick}
          saveDisabled={saveDisabled || hasErrors}
          addLabel={toolbarButtonLabel}
          quickFilter={quickFilter}
          setQuickFilter={setQuickFilter}
          headerSearch={headerSearch}
          setHeaderSearch={setHeaderSearch}
        />

        <Box flex={1} className="ag-theme-quartz">
          <AgGridReact
            ref={ref || gridRef} // <-- forward ref to parent if provided
            rowData={rowData}
            columnDefs={filteredColumnDefs}
            defaultColDef={{
              editable: true,
              resizable: true,
              filter: true,
              floatingFilter: true,
              sortable: true,
              cellStyle: {
                textAlign: "center",
                paddingTop: "2px",
                paddingBottom: "2px",
              },
            }}
            tooltipShowDelay={0}
            getRowClass={(params) =>
              params.data.invalidFields &&
              Object.values(params.data.invalidFields).some(Boolean)
                ? "row-has-error"
                : ""
            }
            tooltipValueGetter={(params) => {
              return params.data.invalidFields?.[params.colDef.field] || "";
            }}
            rowHeight={30}
            quickFilterText={quickFilter}
            onSelectionChanged={(params) =>
              onRowSelected && onRowSelected(params.api.getSelectedRows()[0])
            }
            onCellValueChanged={onCellValueChanged || handleCellValueChanged}
            undoRedoCellEditing
            undoRedoCellEditingLimit={20}
            suppressClickEdit={false}
            animateRows
            pinnedTopRowData={[]}
          />
        </Box>
      </Box>
    );
  }
);

export default AgBaseGrid;
