import { Box } from "@mui/material";
import BaseDataGrid from "../BaseDataGrid";
import {
  SpreadsheetComponent,
  SheetDirective,
  SheetsDirective,
  RangeDirective,
} from "@syncfusion/ej2-react-spreadsheet";

export default function InputGradeTable() {
  return (
    <>
      <Box display="flex" gap={2}>
        {/* Left Column */}
        <Box width="30%" bgcolor="white" p={2} boxShadow={1}>
          fasdada
        </Box>

        {/* Right Column */}
        <Box width="70%" bgcolor="white" p={2} boxShadow={1}>
          <SpreadsheetComponent width="100px%" height="600px" />
        </Box>
      </Box>
    </>
  );
}
