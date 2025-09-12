"use client";
import React, { useState } from "react"; // Importa useEffect y useState
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";
export default function Login() {
  return (
    <>
      <div
        className="card"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div className="card-body">
          <Formulario />
        </div>
      </div>
    </>
  );
}

export function Formulario() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, warning, info

  const [user, setUser] = useState([]);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const irAConsultas = () => {
    router.push("/consultas");
  };
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (user.user === "" || user.password === "") {
        setSnackbarMessage("Favor de llenar todos los campos");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/MATERIAL_FLOW_AD/AUTHENTICATE`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.user.trim(),
              password: user.password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.authorization !== "Unauthorized") {
          setSnackbarMessage("Iniciando Sesion");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("isAuthenticated", "true");

          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        } else {
          setSnackbarMessage(
            "Error en autenticación: " +
              (data.message || "Credenciales inválidas")
          );
          setLoading(false);

          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage(
          "Error al conectar con el servidor, contacte a soporte"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.user === "" || user.password === "") {
      setSnackbarMessage("Favor de llenar todos los campos");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/MATERIAL_FLOW_AD/AUTHENTICATE`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.user.trim(),
            password: user.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.authorization !== "Unauthorized") {
        setSnackbarMessage("Iniciando Sesion");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isAuthenticated", "true");

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setSnackbarMessage(
          "Error en autenticación: " +
            (data.message || "Credenciales inválidas")
        );
        setLoading(false);

        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(
        "Error al conectar con el servidor, contacte a soporte"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Paper elevation={24} sx={{ padding: 7 }}>
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
          sx={{ "& > :not(style)": { m: 1, width: 350 } }}
          noValidate
          autoComplete="off"
          style={{
            width: "370px",
            fontSize: "20px",

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            name="user"
            id="standard-basic"
            className="nombre"
            type="text"
            label="Usuario"
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            name="password"
            id="standard-basic2s"
            className="contraseña"
            type="password"
            label="Contraseña"
            variant="standard"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
              Iniciar Sesion
            </Button>
          </center>
          <a
            onClick={irAConsultas}
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
          >
            Consultas
          </a>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            mt: 2, // margin-top
          }}
        ></Box>
      </Paper>
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
