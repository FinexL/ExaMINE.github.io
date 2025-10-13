import { grey } from "@mui/material/colors";

export const typography = {
  fontFamily: "Roboto, Arial, sans-serif",

  pagename: {
    fontSize: "1.3rem",
    fontWeight: 500,
    textAlign: "left",
    color: grey[900],
  },
  h1: {
    marginTop: "10px",
    fontSize: "2.5rem",
    fontWeight: 700,
    textAlign: "center",
    color: grey[900],
  },

  h2: {
    fontSize: "2rem",
    fontWeight: 600,
    color: "#16b9f9ff",
  },

  // Sub-section heading
  h3: {
    fontSize: "1.75rem",
    fontWeight: 600,
    color: grey[800],
  },

  h4: {
    fontSize: "1.5rem",
    fontWeight: 500,
    color: grey[800],
  },

  h5: {
    fontSize: "1.25rem",
    fontWeight: 500,
    color: grey[700],
  },

  h6: {
    fontSize: "1.125rem",
    fontWeight: 500,
    color: grey[700],
  },

  // Standard body text
  body1: {
    fontSize: "1rem",
    lineHeight: 1.5,
    textAlign: "left",
    color: grey[800],
  },

  // Secondary body text
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.43,
    color: grey[700],
  },

  // Button text
  button: {
    fontSize: "0.875rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: grey[100],
  },
};
