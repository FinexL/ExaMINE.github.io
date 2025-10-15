import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";

const theme = createTheme({
  palette,
  typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            fontSize: "0.95rem",
            height: "42px",
            borderRadius: 12,
            backgroundColor: palette.background.paper,
            "& input": {
              padding: "0px 12px",
              height: "100%",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
            },
            "& fieldset": { borderColor: palette.divider },
            "&:hover fieldset": {
              borderColor: palette.primary.main,
              borderWidth: "2px",
            },
            "&.Mui-focused fieldset": {
              borderColor: palette.primary.main,
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            color: palette.text.secondary,
            transform: "translate(14px, 8px) scale(1)",
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(14px, -6px) scale(0.75)",
          },
          "& .MuiInputLabel-root.Mui-focused": { color: palette.text.primary },
        },
      },
    },
  },
});

export default theme;
