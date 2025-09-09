"use client";
import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
export default function Registrar_Usuario() {
  return (
    <>
      <div
        className="card"
        style={{
          height: "100vh", // Aplica el estilo de altura solo en el cliente
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div
          className="card-body"
          style={{
            width: "365px",
            borderRadius: "25px",
            // height: "100vh", // Aplica el estilo de altura solo en el cliente
            //display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Formulario />
        </div>
      </div>
    </>
  );
}

export function Formulario() {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, warning, info
  const [user, setUser] = useState({
    name: "",
    last_name: "",
    user: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(e.target.value, e.target.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      user.name === "" ||
      user.last_name === "" ||
      user.user === "" ||
      user.password === "" ||
      user.confirm === ""
    ) {
      setSnackbarMessage("Favor de llenar todos los campos");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    } else {
      const buscarUsuario = await axios.get(`api/users/${user.user}`);
      if (buscarUsuario.data === "Usuario no encontrado") {
        if (user.password !== user.confirm) {
          setSnackbarMessage("Las contraseñas no coinciden");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        } else {
          const result = await axios.post("api/users/", user);
          setSnackbarMessage("Usuario agregado correctamente");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          router.push("/");
        }
      } else {
        setSnackbarMessage("El usuario ya existe");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <>
      <center>
        <img
          src="/tristone_logo_head.png"
          alt="Logo"
          style={{
            width: "150px",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </center>
      <h2
        style={{
          width: "350px",
          fontSize: "20px",
        }}
      ></h2>
      <Box
        component="form"
        sx={{ "& > :not(style)": { m: 1, width: "31ch" } }}
        noValidate
        autoComplete="off"
        style={{
          width: "30px",
          fontSize: "20px",
        }}
      >
        <TextField
          name="name"
          id="outlined-basic"
          className="nombre"
          type="text"
          label="Nombre"
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          name="last_name"
          id="outlined-basic1"
          className="last_name"
          type="text"
          label="Apellido"
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          name="user"
          id="outlined-basic2"
          className="Usuario"
          type="text"
          label="Usuario"
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          name="password"
          id="outlined-basic3"
          className="contraseña"
          type="password"
          label="Contraseña"
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          name="confirm"
          id="outlined-basic4"
          className="contraseña"
          type="password"
          label="Confirmar Contraseña"
          variant="outlined"
          onChange={handleChange}
        />
        <center>
          <Button
            onClick={handleSubmit}
            size="large"
            variant="contained"
            disableElevation
            sx={{ width: "350px" }}
            //fullWidth
          >
            Registrarse
          </Button>
        </center>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          mt: 2, // margin-top
        }}
      >
        <Link component="a" variant="body2" href="/" underline="hover">
          Regresar
        </Link>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
