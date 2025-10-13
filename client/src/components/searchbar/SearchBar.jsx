import { TextField } from "@mui/material";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        mr: 1,
        width: 250,
        "& .MuiOutlinedInput-root": {
          borderRadius: 1,
          padding: "2px 8px",
        },
      }}
    />
  );
}
