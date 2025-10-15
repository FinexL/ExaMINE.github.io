import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  Collapse,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import SubjectIcon from "@mui/icons-material/Subject";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GradeIcon from "@mui/icons-material/Grade";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArchiveIcon from "@mui/icons-material/Archive";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import api from "../../api/axios";
import { getProfile } from "../../utils/api";
import useUniversities from "../../hooks/useUniversities";

const drawerWidthOpen = 240;
const drawerWidthClosed = 64;

function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(true);
  const [expand, setExpand] = useState({
    management: false,
    input: false,
    view: false,
    archive: false,
    inhouseInput: false,
    inhouseView: false,
  });
  const [anchorInhouseInput, setAnchorInhouseInput] = useState(null);
  const [anchorInhouseView, setAnchorInhouseView] = useState(null);

  const { rows: universities } = useUniversities();
  const inhouseUniversities = universities.filter((u) => u.modes === "Inhouse");

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getProfile();
      if (profile) setUser(profile);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const topBarHeight = 64; // default MUI Toolbar height on desktop
    document.body.style.paddingTop = `${topBarHeight}px`;
    return () => {
      document.body.style.paddingTop = "0px";
    };
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

  const toggleDrawer = () => setOpen((v) => !v);

  const MaybeTooltip = ({ title, children }) =>
    open ? (
      children
    ) : (
      <Tooltip title={title} placement="right">
        {children}
      </Tooltip>
    );

  const NavParent = ({
    icon,
    label,
    sectionKey,
    defaultTo,
    children,
    collapsible = false,
  }) => (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <MaybeTooltip title={label}>
          <ListItemButton
            onClick={() => {
              if (defaultTo) navigate(defaultTo);
              if (collapsible) {
                setExpand((e) => ({ ...e, [sectionKey]: !e[sectionKey] }));
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
              color: "inherit",
            }}
          >
            {!open && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 0,
                  ml: "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {icon}
              </ListItemIcon>
            )}
            {open && (
              <ListItemText
                primary={label}
                sx={{ color: "inherit", minWidth: 0 }}
                primaryTypographyProps={{
                  sx: {
                    fontSize: "0.75rem",
                    color: "inherit",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            )}
            {open &&
              collapsible &&
              (expand[sectionKey] ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </MaybeTooltip>
      </ListItem>
      {collapsible ? (
        <Collapse in={expand[sectionKey] && open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children}
          </List>
        </Collapse>
      ) : (
        <List component="div" disablePadding>
          {children}
        </List>
      )}
      {open && <Divider sx={{ my: 1 }} />}
    </>
  );

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{ vertical: "center", horizontal: "right" }}
      transformOrigin={{ vertical: "center", horizontal: "left" }}
      keepMounted
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 8,
      marginLeft: theme.spacing(1),
      minWidth: 220,
      color: theme.palette.text.primary,
      boxShadow:
        "rgb(255 255 255 / 0%) 0 0 0 0, rgba(0,0,0,0.05) 0 0 0 1px, rgba(0,0,0,0.10) 0 10px 15px -3px, rgba(0,0,0,0.05) 0 4px 6px -2px",
      "& .MuiMenu-list": { padding: 4 },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const SubItem = ({ to, icon, label }) => (
    <MaybeTooltip title={label}>
      <ListItemButton
        component={RouterLink}
        to={to}
        selected={location.pathname + location.search === to}
        sx={{
          pl: open ? 4 : 0,
          minHeight: 40,
          justifyContent: open ? "initial" : "center",
          textAlign: open ? "left" : "center",
          "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.16)" },
          "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.20)" },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : 0,
            ml: open ? 0 : "auto",
            justifyContent: "center",
            color: "inherit",
          }}
        >
          {icon}
        </ListItemIcon>
        {open && (
          <ListItemText
            primary={label}
            sx={{ color: "inherit" }}
            primaryTypographyProps={{
              sx: { fontSize: "0.75rem", color: "inherit" },
            }}
          />
        )}
      </ListItemButton>
    </MaybeTooltip>
  );

  const NestedToggle = ({ icon, label, sectionKey }) => (
    <ListItem disablePadding sx={{ display: "block" }}>
      <MaybeTooltip title={label}>
        <ListItemButton
          onClick={() =>
            setExpand((e) => ({ ...e, [sectionKey]: !e[sectionKey] }))
          }
          selected={
            (sectionKey === "inhouseInput" &&
              location.pathname === "/input-grades" &&
              location.search.includes("uni=")) ||
            (sectionKey === "inhouseView" &&
              location.pathname === "/view-grades" &&
              location.search.includes("uni="))
          }
          sx={{
            pl: open ? 4 : 0,
            minHeight: 40,
            justifyContent: open ? "initial" : "center",
            textAlign: open ? "left" : "center",
            "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.16)" },
            "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.20)" },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 0,
              ml: open ? 0 : "auto",
              justifyContent: "center",
              color: "inherit",
            }}
          >
            {icon}
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={label}
              sx={{ color: "inherit" }}
              primaryTypographyProps={{
                sx: { fontSize: "0.75rem", color: "inherit" },
              }}
            />
          )}
          {open && (expand[sectionKey] ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </MaybeTooltip>
    </ListItem>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Top Bar */}
      <AppBar
        position="fixed"
        color="secondary"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: open ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
          width: (theme) =>
            `calc(100% - ${open ? drawerWidthOpen : drawerWidthClosed}px)`,
          transition: (theme) =>
            theme.transitions.create(["margin-left", "width"], {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.sharp,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ mr: 2 }} color="inherit">
            Welcome {user?.user_name || ""}
          </Typography>
          <Tooltip title="Profile">
            <IconButton color="inherit">
              <Avatar
                alt={user?.user_name || "Error"}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidthOpen : drawerWidthClosed,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            transition: (theme) =>
              theme.transitions.create("width", {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.sharp,
              }),
          },
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "secondary.main",
                borderRadius: 1,
              }}
            />
            {open && (
              <Typography
                variant="h6"
                noWrap
                sx={{ fontWeight: 700 }}
                color="inherit"
              >
                ExaMINE
              </Typography>
            )}
          </Box>
        </Toolbar>
        <Divider />
        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {/* Dashboard (clickable) */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={RouterLink}
              to="/dashboard"
              selected={location.pathname === "/dashboard"}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                textAlign: open ? "left" : "center",
                "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.16)" },
                "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.20)" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  ml: open ? 0 : "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                <DashboardIcon />
              </ListItemIcon>
              {open && (
                <ListItemText primary="Dashboard" sx={{ color: "inherit" }} />
              )}
            </ListItemButton>
          </ListItem>
          {open && <Divider sx={{ my: 1 }} />}

          {/* Management (redirects to default subpage, shows subitems) */}
          <NavParent
            label="Management"
            sectionKey="management"
            defaultTo="/management"
            collapsible={false}
          >
            <SubItem
              to="/management?tab=student"
              icon={<PeopleIcon />}
              label="Student"
            />
            <SubItem
              to="/management?tab=school"
              icon={<SchoolIcon />}
              label="School"
            />
            <SubItem
              to="/management?tab=subject"
              icon={<SubjectIcon />}
              label="Subject"
            />
            <SubItem
              to="/management?tab=user"
              icon={<ListAltIcon />}
              label="User"
            />
          </NavParent>

          {/* Input Grades */}
          <NavParent
            label="Input Grades"
            sectionKey="input"
            defaultTo="/input-grades"
            collapsible={false}
          >
            <SubItem
              to="/input-grades"
              icon={<ListAltIcon />}
              label="Input Onsite"
            />
            {open ? (
              <NestedToggle
                icon={<ListAltIcon />}
                label="Input Inhouse"
                sectionKey="inhouseInput"
              />
            ) : (
              <ListItem disablePadding sx={{ display: "block" }}>
                <MaybeTooltip title="Input Inhouse">
                  <ListItemButton
                    onClick={(e) => setAnchorInhouseInput(e.currentTarget)}
                    selected={
                      location.pathname === "/input-grades" &&
                      location.search.includes("uni=")
                    }
                    sx={{
                      pl: open ? 4 : 0,
                      minHeight: 40,
                      justifyContent: open ? "initial" : "center",
                      textAlign: open ? "left" : "center",
                      "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.16)" },
                      "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.20)" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        ml: open ? 0 : "auto",
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      <ListAltIcon />
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary="Input Inhouse"
                        sx={{ color: "inherit" }}
                        primaryTypographyProps={{
                          sx: { fontSize: "0.75rem", color: "inherit" },
                        }}
                      />
                    )}
                  </ListItemButton>
                </MaybeTooltip>
              <StyledMenu
                  anchorEl={anchorInhouseInput}
                  open={Boolean(anchorInhouseInput) && !open}
                  onClose={() => setAnchorInhouseInput(null)}
                  container={anchorInhouseInput ? anchorInhouseInput.closest('.MuiDrawer-paper') : undefined}
                >
                  {inhouseUniversities.map((u) => (
                    <MenuItem
                      key={u.university_id}
                      component={RouterLink}
                      to={`/input-grades?uni=${u.university_id}`}
                      selected={
                        location.pathname === "/input-grades" &&
                        location.search.includes(`uni=${u.university_id}`)
                      }
                      onClick={() => setAnchorInhouseInput(null)}
                    >
                      <ListItemIcon sx={{ minWidth: 24, color: "inherit" }}>
                        <SchoolIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ sx: { fontSize: "0.85rem" } }}
                        primary={u.university_name}
                      />
                    </MenuItem>
                  ))}
                </StyledMenu>
              </ListItem>
            )}
            <Collapse
              in={expand.inhouseInput && open}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {inhouseUniversities.map((u) => (
                  <SubItem
                    key={u.university_id}
                    to={`/input-grades?uni=${u.university_id}`}
                    icon={<SchoolIcon />}
                    label={u.university_name}
                  />
                ))}
              </List>
            </Collapse>
          </NavParent>

          {/* View Grades */}
          <NavParent
            label="View Grades"
            sectionKey="view"
            defaultTo="/view-grades"
            collapsible={false}
          >
            <SubItem
              to="/view-grades"
              icon={<ListAltIcon />}
              label="View Onsite"
            />
            {open ? (
              <NestedToggle
                icon={<ListAltIcon />}
                label="View Inhouse"
                sectionKey="inhouseView"
              />
            ) : (
              <ListItem disablePadding sx={{ display: "block" }}>
                <MaybeTooltip title="View Inhouse">
                  <ListItemButton
                    onClick={(e) => setAnchorInhouseView(e.currentTarget)}
                    selected={
                      location.pathname === "/view-grades" &&
                      location.search.includes("uni=")
                    }
                    sx={{
                      pl: open ? 4 : 0,
                      minHeight: 40,
                      justifyContent: open ? "initial" : "center",
                      textAlign: open ? "left" : "center",
                      "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.16)" },
                      "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.20)" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                        ml: open ? 0 : "auto",
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      <ListAltIcon />
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary="View Inhouse"
                        sx={{ color: "inherit" }}
                        primaryTypographyProps={{
                          sx: { fontSize: "0.75rem", color: "inherit" },
                        }}
                      />
                    )}
                  </ListItemButton>
                </MaybeTooltip>
              <StyledMenu
                  anchorEl={anchorInhouseView}
                  open={Boolean(anchorInhouseView) && !open}
                  onClose={() => setAnchorInhouseView(null)}
                  container={anchorInhouseView ? anchorInhouseView.closest('.MuiDrawer-paper') : undefined}
                >
                  {inhouseUniversities.map((u) => (
                    <MenuItem
                      key={u.university_id}
                      component={RouterLink}
                      to={`/view-grades?uni=${u.university_id}`}
                      selected={
                        location.pathname === "/view-grades" &&
                        location.search.includes(`uni=${u.university_id}`)
                      }
                      onClick={() => setAnchorInhouseView(null)}
                    >
                      <ListItemIcon sx={{ minWidth: 24, color: "inherit" }}>
                        <SchoolIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{ sx: { fontSize: "0.85rem" } }}
                        primary={u.university_name}
                      />
                    </MenuItem>
                  ))}
                </StyledMenu>
              </ListItem>
            )}
            <Collapse
              in={expand.inhouseView && open}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {inhouseUniversities.map((u) => (
                  <SubItem
                    key={u.university_id}
                    to={`/view-grades?uni=${u.university_id}`}
                    icon={<SchoolIcon />}
                    label={u.university_name}
                  />
                ))}
              </List>
            </Collapse>
          </NavParent>

          {/* Archive */}
          <NavParent
            label="Archive"
            sectionKey="archive"
            defaultTo="/archive"
            collapsible={false}
          >
            <SubItem to="/archive" icon={<ArchiveIcon />} label="Record" />
          </NavParent>
        </List>
      </Drawer>

      {/* Content spacer handled globally via body margins */}
    </Box>
  );
}

export default MainNav;
