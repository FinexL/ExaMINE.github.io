import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';

const theme = createTheme({
  palette,
  typography,
  components: {
    MuiTextField:{
      styleOverrides:{
        root:{
            "& .MuiOutlinedInput-root":
              {
                fontSize: "0.9rem",
                height:"40px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                "& input":{
                  padding: "0px 12px",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
               
                },
                "& fieldset": {borderColor: "#ccc",},
                "&:hover fieldset": { 
                  borderColor: palette.primary.main,
                  borderWidth:"2px",
                },
            },
              "& .MuiInputLabel-root": {
          color: "#666",
          transform: "translate(14px, 8px) scale(1)", // 👈 lowered baseline label
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -6px) scale(0.75)", // 👈 closer floating label
        },

              "& .MuiInputLabel-root.Mui-focused": {color: palette.text.primary,},
          },
          },
        },
},
    
});

export default theme;