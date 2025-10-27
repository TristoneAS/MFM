"use client";

import {
  AppBar,
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
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import PendingIcon from "@mui/icons-material/Pending";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import HistoryIcon from "@mui/icons-material/History";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { DataContext } from "@/contexts/dataContext";

export default function NavBar() {
  const [admin, setAdmin] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const { name, setName } = useContext(DataContext);
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  useEffect(() => {
    const titulo = localStorage.getItem("titulo");
    if (title === "") {
      setTitle(titulo);
    }
  }, [title]);
  const handleClickNavegar = (key) => {
    let lowerKey = key.toLowerCase().replace(/ /g, "");
    if (lowerKey === "dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/${lowerKey}`);
      setTimeout(() => {
        setTitle(key);
        localStorage.setItem("titulo", key);
      }, 500);
    }
  };

  const handleClickCerrarSesion = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("titulo");
    localStorage.removeItem("emp_id");
    localStorage.removeItem("admin");

    router.push("/");
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userInfo = localStorage.getItem("user");

    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        const users = parsedUserInfo.data?.users;
        const roles = parsedUserInfo.data?.groups[0].cn;
        console.log("Los roles osn", roles);

        if (roles.includes("Admin")) {
          setAdmin(true);
          localStorage.setItem("admin", "true");
        } else {
          localStorage.setItem("admin", "false");
        }

        ///////////******************************************************************************************************************************************* */
        if (users && users.length > 0) {
          const cn = users[0].cn;
          setName(cn);
          const emp_id = users[0].employeeID;
          localStorage.setItem("emp_id", emp_id);
        }
      } catch (error) {
        console.error("Error al parsear el JSON:", error);
      }
    }

    if (isAuthenticated !== "true") {
      router.push("/");
    }
  }, []);

  const iconMap = {
    Dashboard: <DashboardIcon />,
    "Nuevo Folio": <AddCircleIcon />,
    "Mis Solicitudes": <ContentPasteIcon />,
    "Mis Pendientes": <PendingIcon />,
    Historial: <HistoryIcon />,
    "Ver todos": <VisibilityIcon />,
    Configuracion: <SettingsIcon />,
  };

  const DrawerList = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <img
          src="/tristone_logo_head.png"
          alt="Logo Drawer"
          style={{ width: "120px" }}
        />
      </Box>
      <List>
        {["Nuevo Folio", "Mis Solicitudes", "Mis Pendientes", "Historial"].map(
          (text) => (
            <ListItem
              key={text}
              disablePadding
              onClick={() => handleClickNavegar(text)}
            >
              <ListItemButton>
                <ListItemIcon>{iconMap[text]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      {admin && (
        <List>
          {["Ver todos", "Configuracion"].map((text) => (
            <ListItem
              key={text}
              disablePadding
              onClick={() => handleClickNavegar(text)}
            >
              <ListItemButton>
                <ListItemIcon>{iconMap[text]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontfamily: " Arial, Helvetica, sans-serif",

                letterSpacing: "0.5px",
              }}
            >
              {/*  {title} */}
              SALIDA MATERIAL
            </Typography>

            <IconButton
              onClick={handleClick}
              color="inherit"
              sx={{ mr: "1cm" }}
            >
              <AccountCircleIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: {
                  minWidth: "200px", // Cambia el ancho del menú
                },
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "12px 0",
                  background: "#f5f5f5",
                }}
              >
                <img
                  src="/tristone_logo_head.png"
                  alt="Logo usuario"
                  style={{ width: "80px" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%", // Ajusta al 100% del Paper
                  background: "rgb(250,250,250)",
                  height: "40px",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                {name}
              </div>

              <Divider />

              {/*   <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Perfil
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Configuración
              </MenuItem> */}
              <MenuItem onClick={handleClickCerrarSesion}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList />
      </Drawer>
    </div>
  );
}
