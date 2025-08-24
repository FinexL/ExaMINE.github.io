import ContentBox from "../components/ContentBox";
import { Typography, Box, TextField } from "@mui/material";
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
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
//import UserTable from "../components/tables/management/UserTable";

function InputGrades() {
  return (
    <>
      <ContentBox>
        <Box display="flex" gap={2}>
          <Box width="20%" bgcolor="white" p={2} boxShadow={1}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Topic
              </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                required
                name="/"
                label="Topic Name"
                margin="normal"
              />
              <TextField
                fullWidth
                name="/"
                label="Subject Name"
                margin="normal"
              />
              <TextField
                fullWidth
                required
                name="/"
                label="Type"
                margin="normal"
              />
              <TextField
                fullWidth
                required
                name="/"
                label="Total Points"
                margin="normal"
              />
            </Box>
          </Box>

          {/* Right Column */}
          <Box width="80%" bgcolor="white" p={2} boxShadow={1}>
            <SpreadsheetComponent minwidth="100" width="100%" height="100%" />
          </Box>
        </Box>
      </ContentBox>
    </>
  );
}

export default InputGrades;
