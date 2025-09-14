// src/components/tables/input/BaseDataGrid.jsx
import { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import InputGradeToolbar from "../../buttons/InputGradeToolbar";

export default function BaseDataGrid({
  rowData,
  columnDefs,
  raw,
  setRows,
  onCellValueChanged,
  onAddClick,
  onSaveClick,
  saveDisabled = true,
  toolbarButtonLabel = "Add Exam",
}) {
  const gridRef = useRef();

  const handleCellValueChanged = (params) => {
    const { colDef, newValue, oldValue, data, api } = params;
    const field = colDef.field;

    if (field === "studentName") return;

    let value;

    if (newValue === "" || newValue === null) {
      value = "NO EXAM"; // show in table
    } else {
      value = Number(newValue);
      const max = raw.subjects.find((s) => s.subject_name === field)?.items;

      if (isNaN(value) || value < 0 || (max && value > max)) {
        alert(`Grade must be between 0 and ${max}`);
        data[field] = oldValue;
        api.refreshCells({ rowNodes: [params.node], columns: [field] });
        return;
      }
    }

    data[field] = value;
    api.refreshCells({ rowNodes: [params.node], columns: [field] });

    setRows((prev) =>
      prev.map((r) => (r.id === data.id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      <InputGradeToolbar
        onAddClick={onAddClick}
        onSaveClick={onSaveClick}
        saveDisabled={saveDisabled}
        addLabel={toolbarButtonLabel}
      />
      <div className="ag-theme-alpine" style={{ width: "100%", height: "90%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: true,
            resizable: true,
            sortable: true,
          }}
          onCellValueChanged={onCellValueChanged || handleCellValueChanged}
          suppressClickEdit={false}
          animateRows
          pinnedTopRowData={[]}
        />
      </div>
    </div>
  );
}
