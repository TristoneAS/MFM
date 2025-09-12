"use client";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Visualizar from "./Visualizar";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// 👇 teclado virtual
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function Consultas() {
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [folioRows, setFolioRows] = useState([]);
  const [materialRows, setMaterialRows] = useState([]);
  const [paqueteriaRows, setPaqueteriaRows] = useState([]);
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
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

  const handleKeyboardChange = (input) => {
    setInputValue(input);
  };

  const handleKeyPress = (button) => {
    if (button === "{enter}") {
      setKeyboardOpen(false); // cerrar modal al presionar enter
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
        ocultar={false}
        idSelected={inputValue}
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
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <input
          type="text"
          value={inputValue}
          inputMode="numeric"
          pattern="[0-9]*"
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
          onClick={() => setKeyboardOpen(true)}
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
          onClick={() => {
            handleClickVerFolio(inputValue);
          }}
        >
          Ver
        </button>
      </div>

      {/* Modal flotante con teclado y botón cerrar */}
      <Modal
        open={keyboardOpen}
        onClose={() => setKeyboardOpen(false)}
        aria-labelledby="teclado-virtual"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField value={inputValue}></TextField>
          <Keyboard
            onChange={handleKeyboardChange}
            onKeyPress={handleKeyPress}
            input={inputValue}
            layout={{
              default: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"],
            }}
            display={{
              "{bksp}": "⌫",
              "{enter}": "Ok",
            }}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default Consultas;
