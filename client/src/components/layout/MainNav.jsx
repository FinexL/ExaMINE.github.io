import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
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

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";

import SchoolIcon from "@mui/icons-material/School";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleIcon from "@mui/icons-material/People";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ViewListIcon from "@mui/icons-material/ViewList";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarIcon from "@mui/icons-material/Star";
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

  // Shift page content so the Drawer does not cover it
  useEffect(() => {
    document.body.style.marginLeft = `${
      open ? drawerWidthOpen : drawerWidthClosed
    }px`;
    document.body.style.transition = "margin-left 250ms ease-in-out";
    return () => {
      document.body.style.marginLeft = "0px";
      document.body.style.transition = "";
    };
  }, [open]);

  // When collapsing the sidebar, also collapse Inhouse lists
  useEffect(() => {
    if (!open) {
      setExpand((e) => ({
        ...e,
        inhouseInput: false,
        inhouseView: false,
      }));
    }
  }, [open]);

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

  // When sidebar is collapsed, clicking a collapsible section should expand the drawer first
  const handleSectionToggle = (sectionKey) => {
    if (!open) {
      setOpen(true);
      setTimeout(() => {
        setExpand((e) => ({ ...e, [sectionKey]: true }));
      }, 150);
    } else {
      setExpand((e) => ({ ...e, [sectionKey]: !e[sectionKey] }));
    }
  };

  const MaybeTooltip = ({ title, children }) =>
    open ? (
      children
    ) : (
      <Tooltip title={title} placement="right">
        {children}
      </Tooltip>
    );

  const NavParent = ({
    label,
    sectionKey,

    children,
    collapsible = false,
  }) => (
    <>
      {open && (
        <ListItem disablePadding sx={{ display: "block", px: 2.5 }}>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "inherit",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </Typography>
            }
            sx={{ color: "inherit", minWidth: 0 }}
          />
        </ListItem>
      )}
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
      <Divider sx={{ my: 1, width: "90%", mx: "auto" }} />
    </>
  );

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
          transition: (theme) =>
            theme.transitions.create(
              ["padding-left", "background-color", "color"],
              {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.easeInOut,
              }
            ),
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : 0,
            ml: open ? 0 : "auto",
            justifyContent: "center",
            color: "inherit",
            transition: (theme) =>
              theme.transitions.create(["margin", "color"], {
                duration: theme.transitions.duration.shorter,
                easing: theme.transitions.easing.easeInOut,
              }),
          }}
        >
          {icon}
        </ListItemIcon>
        {open && (
          <ListItemText
            primary={
              <Typography sx={{ fontSize: "0.75rem", color: "inherit" }}>
                {label}
              </Typography>
            }
            sx={{ color: "inherit" }}
          />
        )}
      </ListItemButton>
    </MaybeTooltip>
  );

  const NestedToggle = ({ icon, label, sectionKey }) => (
    <ListItem disablePadding sx={{ display: "block" }}>
      <MaybeTooltip title={label}>
        <ListItemButton
          onClick={() => handleSectionToggle(sectionKey)}
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
            transition: (theme) =>
              theme.transitions.create(
                ["padding-left", "background-color", "color"],
                {
                  duration: theme.transitions.duration.shorter,
                  easing: theme.transitions.easing.easeInOut,
                }
              ),
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 0,
              ml: open ? 0 : "auto",
              justifyContent: "center",
              color: "inherit",
              transition: (theme) =>
                theme.transitions.create(["margin", "color"], {
                  duration: theme.transitions.duration.shorter,
                  easing: theme.transitions.easing.easeInOut,
                }),
            }}
          >
            {icon}
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={
                <Typography sx={{ fontSize: "0.75rem", color: "inherit" }}>
                  {label}
                </Typography>
              }
              sx={{ color: "inherit" }}
            />
          )}
          {open && (expand[sectionKey] ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </MaybeTooltip>
    </ListItem>
  );

  return (
    <Box sx={{ display: "flex" }}>
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
              easing: theme.transitions.easing.easeInOut,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ mr: 2 }} color="primary">
            Welcome {user?.user_name || ""}
          </Typography>
          <Tooltip title="Profile">
            <IconButton color="primary">
              <Avatar
                alt={user?.user_name || "Error"}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="primary" onClick={handleLogout}>
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
            color: "secondary.main",
            transition: (theme) =>
              theme.transitions.create("width", {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeInOut,
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
                <ListItemText
                  label="Dashboard"
                  primary="Dashboard"
                  sx={{ color: "inherit" }}
                />
              )}
            </ListItemButton>
          </ListItem>
          <Divider sx={{ my: 1, width: "80%", mx: "auto" }} />

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
              icon={<MenuBookIcon />}
              label="Subject"
            />
            <SubItem
              to="/management?tab=user"
              icon={<GroupAddIcon />}
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
              icon={<StarBorderOutlinedIcon />}
              label="Input Onsite"
            />
            <NestedToggle
              icon={<ViewListOutlinedIcon />}
              label="Input Inhouse"
              sectionKey="inhouseInput"
            />
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
                    icon={<SchoolOutlinedIcon />}
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
              icon={<StarIcon />}
              label="View Onsite"
            />
            <NestedToggle
              icon={<ViewListIcon />}
              label="View Inhouse"
              sectionKey="inhouseView"
            />
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
