import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Avatar,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../../api/axios";
import { getProfile } from "../../utils/api";

const pages = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Input Grades", path: "/input-grades" },
  { name: "View Grades", path: "/view-grades" },
  { name: "Management", path: "/management" },
  { name: "Archive", path: "/archive" },
];

function Nav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getProfile();
      if (profile) setUser(profile);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/dashboard"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ExaMINE
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Avatar + Username */}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            {user && (
              <Box sx={{ mr: 1 }}>
                <Typography
                  sx={{ lineHeight: 1, textAlign: "right" }}
                  color="white"
                >
                  {user.user_name}
                </Typography>
                <Typography
                  sx={{
                    lineHeight: 1,
                    fontSize: "0.75rem",
                    textAlign: "right",
                  }}
                  color="white"
                >
                  {user.user_role}
                </Typography>
              </Box>
            )}
            <Tooltip title="Profile">
              <IconButton>
                <Avatar
                  alt={user?.user_name || "User Avatar"}
                  src="/static/images/avatar/2.jpg"
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton sx={{ color: "white" }} onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Nav;
