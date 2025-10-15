export const typography = {
  // Modern, clean sans with fallbacks
  fontFamily:
    "Inter, Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif",

  // Page title utility used across app
  pagename: {
    fontSize: "1.375rem", // 22px
    fontWeight: 600,
    letterSpacing: "0.01em",
    lineHeight: 1.3,
    textAlign: "left",
  },

  // Headings — slightly tighter and bolder for modern look
  h1: {
    fontSize: "2.25rem", // 36px
    fontWeight: 700,
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
  },
  h2: {
    fontSize: "1.75rem", // 28px
    fontWeight: 700,
    letterSpacing: "-0.005em",
    lineHeight: 1.25,
  },
  h3: {
    fontSize: "1.5rem", // 24px
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: "1.25rem", // 20px
    fontWeight: 600,
    lineHeight: 1.35,
  },
  h5: {
    fontSize: "1.125rem", // 18px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: "1rem", // 16px
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // Body copy — readable and balanced
  body1: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    letterSpacing: "0.01em",
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },

  // Subtitles and captions
  subtitle1: {
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: "0.825rem",
    fontWeight: 500,
  },
  caption: {
    fontSize: "0.75rem",
  },
  overline: {
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  // Buttons — modern, no forced uppercase
  button: {
    fontSize: "0.9rem",
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.01em",
  },
};
