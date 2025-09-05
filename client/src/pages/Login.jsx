import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CoverImage from "../assets/cover.jpg";
import { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // send request to backend
      const res = await axios.post("http://localhost:5202/api/auth/login", {
        username,
        password,
      });

      // Example: save token/user to localStorage
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // navigate to dashboard if login is successful
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.main",
        backgroundImage: { xs: "none", md: `url(${CoverImage})` },
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

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="tertiary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

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
