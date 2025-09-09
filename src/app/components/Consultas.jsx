"use client";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  TextField,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Visualizar from "./Visualizar";

import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useRouter } from "next/navigation";
import Modal from "@mui/material/Modal";
import axios from "axios";

function consultas() {
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [folioRows, setFolioRows] = useState([]);
  const [materialRows, setMaterialRows] = useState([]);
  const [paqueteriaRows, setPaqueteriaRows] = useState([]);
  const [ocultarBoton, setOcultarBoton] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const handleChange = (e) => {
    // Convertimos el valor a número, si quieres mantenerlo como string puedes quitar Number()
    setIdSelected(e.target.value ? Number(e.target.value) : null);
  };
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Regresar"].map((text) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => {
              handleClickNavegar(text);
            }}
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleClickNavegar = (key) => {
    if (key.toLowerCase() === "regresar") {
      router.push("/");
    }
  };
  const handleClickVerFolio = async (folio_id) => {
    try {
      const buscarFolio = await axios.get(
        `/api/folio_consultas/?folio_id=${folio_id}`
      );
      if (buscarFolio.data.length > 0) {
        setFolioRows(buscarFolio.data[0]);
      } else {
        console.log("No se encontró registro");
      }

      const buscarMaterial = await axios.get(
        `/api/material_consultas/?folio_id=${folio_id}`
      );
      if (buscarMaterial.data.length > 0) {
        setMaterialRows(buscarMaterial.data);
      } else {
        console.log("No se encontró material");
      }

      const buscarPaqueteria = await axios.get(
        `/api/paqueteria/?folio_id=${folio_id}`
      );
      console.log("la paq es", buscarPaqueteria.data);
      if (buscarPaqueteria.data.length > 0) {
        setPaqueteriaRows(buscarPaqueteria.data);
      } else {
        console.log("No se encontró paquetería");
      }

      setOpenVisualizar(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img
                src="/tristone_logo_head.png"
                alt="Logo"
                style={{
                  display: "flex",
                  width: "80px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
              <center>Consultar Folios</center>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <Visualizar
        open={openVisualizar}
        setOpen={setOpenVisualizar}
        folioRows={folioRows}
        materialRows={materialRows}
        paqueteriaRows={paqueteriaRows}
        ocultar={ocultarBoton}
        idSelected={idSelected}
        setRows={setRows}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "7cm",
          marginRight: "7cm",
          marginTop: "1cm",
          background: "rgb(250,250,250)",
          height: "33rem",
          gap: "1rem", // separa el textfield del botón
          padding: "1rem",
        }}
      >
        <input
          type="text" // usamos text + inputmode
          inputMode="numeric" // fuerza teclado numérico en móviles
          pattern="[0-9]*" // restringe solo números
          placeholder="Ingresa un número"
          onChange={handleChange}
          style={{
            width: "50%",
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            textAlign: "center",
          }}
        />
        <button
          style={{
            padding: "0.5rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => handleClickVerFolio(idSelected)}
        >
          Ver
        </button>
      </div>
    </div>
  );
}

export default consultas;
