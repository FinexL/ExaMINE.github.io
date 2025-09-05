import ContentBox from "../components/ContentBox";
import { useState, useRef } from "react";
import { Typography, Box, Paper } from "@mui/material";
import AddButton from "../components/buttons/AddButton";
import ExamForm from "../components/forms/ExamForm";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-spreadsheet/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-grids/styles/material.css";

// add import for import grades
import {
  RangeDirective,
  RangesDirective,
  SheetDirective,
  SheetsDirective,
  SpreadsheetComponent,
} from "@syncfusion/ej2-react-spreadsheet";

const icon = (
  <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
    <svg>
      <Box
        component="polygon"
        points="0,100 50,00, 100,100"
        sx={(theme) => ({
          fill: theme.palette.common.white,
          stroke: theme.palette.divider,
          strokeWidth: 1,
        })}
      />
    </svg>
  </Paper>
);

function InputGrades() {
  const spreadsheetRef = useRef(null);
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => setOpenForm(false);

  return (
    <>
      <ContentBox>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          width="100%"
          height="80vh"
          gap={2}
          p={2}
        >
          <Box
            sx={{ width: "20%" }}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Input Grades
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {/* 🔹 Your Add button */}
              <AddButton onClick={handleOpenForm} />

              {/* 🔹 ExamForm Dialog */}
              <ExamForm
                open={openForm}
                onClose={handleCloseForm}
                spreadsheetRef={spreadsheetRef}
                onSuccess={() => {
                  console.log("Exam added successfully!");
                }}
              />
            </Box>
          </Box>

          {/* Right Column */}
          <Box sx={{ width: "80%" }} bgcolor="white" p={2} boxShadow={1}>
            <SpreadsheetComponent
              ref={spreadsheetRef}
              width="100%"
              height="100%"
            >
              <SheetsDirective>
                <SheetDirective name="Prelim">
                  <RangesDirective>
                    <RangeDirective></RangeDirective>
                  </RangesDirective>
                </SheetDirective>
                <SheetDirective name="Midterm">
                  <RangesDirective>
                    <RangeDirective></RangeDirective>
                  </RangesDirective>
                </SheetDirective>
                <SheetDirective name="Finals">
                  <RangesDirective>
                    <RangeDirective></RangeDirective>
                  </RangesDirective>
                </SheetDirective>
              </SheetsDirective>
            </SpreadsheetComponent>
          </Box>
        </Box>
      </ContentBox>
    </>
  );
}

export default InputGrades;
