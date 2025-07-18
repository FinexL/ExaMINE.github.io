import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CoverImage from "../assets/cover.jpg";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add validation/auth here
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.main",
        backgroundImage: {
          xs: "none",
          md: `url(${CoverImage})`,
        },
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          position: "relative",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            position: "absolute",
            top: 8,
            right: 12,
            color: "tertiary.main",
            fontWeight: "bold",
          }}
        >
          Merge ExaMINE
        </Typography>

        <Typography variant="h4" color="tertiary" gutterBottom>
          Welcome Back
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary" }}
          gutterBottom
        >
          Please enter your credentials to log in.
        </Typography>

        {/* Input Fields */}
        <TextField
          label="Email/Username"
          fullWidth
          margin="normal"
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="current-password"
        />

        {/* Login Button */}
        <Button
          variant="contained"
          color="tertiary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* Forgot Credentials */}
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "primary.main",
            cursor: "pointer",
          }}
          onClick={() =>
            alert("Please contact the admin to recover your credentials.")
          }
        >
          Forgot credentials?
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
