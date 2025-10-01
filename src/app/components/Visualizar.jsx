"use client";
import {
  Box,
  TextField,
  Paper,
  Table,
  TableBody,
  Button,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import React from "react";
import Modal from "@mui/material/Modal";
import Mensaje from "./Mensaje";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Visualizar({
  open,
  setOpen,
  folioRows,
  materialRows,
  paqueteriaRows,
  ocultar,
  idSelected,
  setRows,
}) {
  const printRef = useRef(); //  Declarar el ref aquí

  const handleDownloadPDF = async () => {
    const element = printRef.current;

    // Renderizar el contenido en un canvas grande
    const canvas = await html2canvas(element, { scale: 2 });

    const pdf = new jsPDF("p", "mm", "letter");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const marginBottom = 15; // margen inferior en mm para la numeración
    const usablePdfHeight = pdfHeight - marginBottom; // altura disponible para la imagen

    // Escalar el alto proporcional al ancho del PDF
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    let pageIndex = 0;

    while (heightLeft > 0) {
      // Crear un canvas temporal con el tamaño de UNA página
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = (usablePdfHeight * canvas.width) / pdfWidth;

      // Recortar la parte correspondiente de la imagen original
      pageCtx.drawImage(
        canvas,
        0,
        position,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const pageData = pageCanvas.toDataURL("image/png");

      if (pageIndex > 0) pdf.addPage(); // evitar página en blanco inicial
      pdf.addImage(pageData, "PNG", 0, 0, pdfWidth, usablePdfHeight);

      heightLeft -= usablePdfHeight;
      position += pageCanvas.height;
      pageIndex++;
    }

    // Número total de páginas
    const totalPages = pdf.internal.getNumberOfPages();

    // Agregar numeración a cada página dentro del margen
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Página ${i} de ${totalPages}`, pdfWidth - 40, pdfHeight - 10);
    }

    pdf.save(`Salida de material folio ${folioRows.folio_id}.pdf`);
  };

  console.log(folioRows);
  const [loading, setLoading] = useState(false);

  const [openError, setOpenError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("error");
  const Success = (title) => {
    setMensaje("Aprobado folio: " + title);
    setEstado("success");
    setOpenError(true);
  };
  const Advertencia = (title) => {
    setMensaje("Rechazado folio: " + title);
    setEstado("warning");
    setOpenError(true);
  };
  const [aprobado, setAprobado] = useState({
    ap1: false,
    sup: false,
    ap2: false,
  });
  const [espera, setEspera] = useState({ ap1: true, sup: true, ap2: true });
  const [rechazado, setRechazado] = useState({
    ap1: false,
    sup: false,
    ap2: false,
  });
  useEffect(() => {
    console.log("useefect");

    if (
      folioRows.status_1 === "Pendiente" ||
      folioRows.status_S === "Pendiente"
    ) {
      setAprobado({ ap1: false, sup: false, ap2: aprobado.ap2 });
      setEspera({ ap1: true, sup: true, ap2: espera.ap2 });
      setRechazado({ ap1: false, sup: false, ap2: rechazado.ap2 });
      console.log("Pendiente");
    }
    if (
      folioRows.status_1 === "Rechazado" ||
      folioRows.status_S === "Rechazado"
    ) {
      setAprobado({ ap1: false, sup: false, ap2: aprobado.ap2 });
      setEspera({ ap1: false, sup: false, ap2: espera.ap2 });
      setRechazado({ ap1: true, sup: true, ap2: rechazado.ap2 });
    }

    if (
      folioRows.status_1 === "Aprobado" ||
      folioRows.status_S === "Aprobado"
    ) {
      setAprobado({ ap1: true, sup: true, ap2: aprobado.ap2 });
      setEspera({ ap1: false, sup: false, ap2: espera.ap2 });
      setRechazado({ ap1: false, sup: false, ap2: rechazado.ap2 });
      console.log("Aprobado");
    }
    if (folioRows.status_2 === "Aprobado") {
      setAprobado((prev) => ({
        ...prev,
        ap2: true,
      }));
      setEspera((prev) => ({
        ...prev,
        ap2: false,
      }));
      setRechazado((prev) => ({
        ...prev,
        ap2: false,
      }));
    }
    if (folioRows.status_2 === "Rechazado") {
      setAprobado((prev) => ({
        ...prev,
        ap2: false,
      }));
      setEspera((prev) => ({
        ...prev,
        ap2: false,
      }));
      setRechazado((prev) => ({
        ...prev,
        ap2: true,
      }));
    }
    if (folioRows.status_2 === "Pendiente") {
      setAprobado((prev) => ({
        ...prev,
        ap2: false,
      }));
      setEspera((prev) => ({
        ...prev,
        ap2: true,
      }));
      setRechazado((prev) => ({
        ...prev,
        ap2: false,
      }));
    }
    console.log(aprobado, rechazado, espera);
  }, [open]);

  const handleClose = () => setOpen(false);

  const handleClickAprobar = async () => {
    try {
      const emp_id = localStorage.getItem("emp_id");

      if (idSelected === null) {
        console.log("Selecciona un folio");
      } else {
        await axios.put(`/api/folio/${idSelected}`, {
          createdby: emp_id,
          status: "Aprobado",
        });
        setOpen(false);

        setLoading(true);
        const res = await axios.get(`/api/folio_consultas/?emp_id=${emp_id}`);
        setRows(res.data);
        setTimeout(() => {
          Success(idSelected);

          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClickRechazar = async () => {
    try {
      const emp_id = localStorage.getItem("emp_id");

      if (idSelected === null) {
        console.log("Selecciona un folio");
      } else {
        await axios.put(`/api/folio/${idSelected}`, {
          createdby: emp_id,
          status: "Rechazado",
        });
        setOpen(false);

        setLoading(true);
        const res = await axios.get(`/api/folio_consultas/?emp_id=${emp_id}`);
        setRows(res.data);
        setTimeout(() => {
          Advertencia(idSelected);

          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {/* MODAL */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 2,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: 24,
            width: "65rem",
          }}
        >
          <div
            ref={printRef}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {" "}
              <img
                src="/tristone_logo_head.png"
                alt="Logo"
                style={{
                  width: "120px",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              />{" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginLeft: "2.5cm",
                  width: "100%",
                }}
              >
                {" "}
                <p
                  style={{
                    display: "flex",
                    fontSize: "1.5rem",
                    marginTop: "-1cm",
                    fontWeight: "bold",
                  }}
                >
                  {folioRows.documento}
                </p>{" "}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexDirection: "column",
                    alignItems: "stretch",
                    height: "100%",
                    mt: 3, // margen arriba, puedes cambiar el número
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "normal",
                      color: "text.primary",
                      fontSize: "0.78rem",
                      "& strong": {
                        fontSize: "0.80rem",
                      },
                    }}
                  >
                    <strong>Fecha:</strong>{" "}
                    {new Date(folioRows.fecha).toLocaleDateString("es-ES")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "normal",
                      color: "text.primary",
                      fontSize: "0.78rem", // 👈 texto normal
                      "& strong": {
                        fontSize: "0.80rem", // 👈 los <strong> un poco más grandes
                      },
                    }}
                  >
                    <strong>Folio control:</strong> {folioRows.folio_id}
                  </Typography>
                </Box>
              </div>
            </div>
            {/* Primera fila de datos */}
            {/* TABLA ORIGEN */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 0, color: "#1976d2", mt: 0 }}
            >
              Informacion origen-destino
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {/* Tabla ORIGEN */}
              <TableContainer
                component={Paper}
                elevation={6}
                sx={{
                  flex: 1,
                  minWidth: 340,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderRadius: 0,
                }}
              >
                <Table size="small">
                  <TableBody
                    sx={{
                      "& .MuiTableRow-root": {
                        "& .MuiTableCell-root": {
                          py: 0.2, // 👈 padding vertical mínimo
                          fontSize: "0.75rem", // más compacto
                        },
                      },
                      "& .MuiTableRow-root:first-of-type .MuiTableCell-root": {
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "rgb(0,66,105)",
                        py: 0.25, // encabezado un poquito más
                      },
                    }}
                  >
                    {/* Encabezado */}
                    <TableRow>
                      <TableCell colSpan={2}>Origen:</TableCell>
                    </TableRow>

                    {/* Filas de datos */}
                    <TableRow>
                      <TableCell>Ubicacion:</TableCell>
                      <TableCell>{folioRows?.origen_location || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dirección:</TableCell>
                      <TableCell>
                        {folioRows?.origen_direccion || "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Contacto:</TableCell>
                      <TableCell>{folioRows?.origen_contacto || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tel & Email:</TableCell>
                      <TableCell>{folioRows?.origen_correo || "-"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Tabla DESTINO */}
              <TableContainer
                component={Paper}
                elevation={6}
                sx={{
                  flex: 1,
                  minWidth: 340,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderRadius: 0,
                }}
              >
                <Table size="small">
                  <TableBody
                    sx={{
                      "& .MuiTableRow-root": {
                        "& .MuiTableCell-root": {
                          py: 0.2, // 👈 padding vertical mínimo para filas de datos
                          fontSize: "0.75rem", // más compacto
                        },
                      },
                      "& .MuiTableRow-root:first-of-type .MuiTableCell-root": {
                        fontWeight: "bold",
                        color: "#fff",
                        backgroundColor: "rgb(0,66,105)",
                        py: 0.25, // encabezado un poco más alto
                        fontSize: "0.78rem",
                      },
                    }}
                  >
                    {/* Encabezado */}
                    <TableRow>
                      <TableCell colSpan={2}>Destino:</TableCell>
                    </TableRow>

                    {/* Filas de datos */}
                    <TableRow>
                      <TableCell>Ubicacion:</TableCell>
                      <TableCell>
                        {folioRows?.destino_location || "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dirección:</TableCell>
                      <TableCell>
                        {folioRows?.destino_direccion || "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Contacto:</TableCell>
                      <TableCell>
                        {folioRows?.destino_contacto || "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tel & Email:</TableCell>
                      <TableCell>{folioRows?.destino_correo || "-"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            {/* Tabla 1 */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 0, color: "#1976d2", mt: 1.5 }}
            >
              Datos de envio
            </Typography>
            <Table size="small" aria-label="articulos table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgb(0,66,105)" }}>
                  {[
                    "Sello",
                    "Transportista",
                    "Modo de envio",
                    "Caja#",
                    "Incoterm",
                    "Tipo de material",
                    "Razon",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.80rem", //aqui
                        textAlign: "center",
                        py: 0.1,
                      }}
                      align="center"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.sello || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.transportista || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.modo_envio || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.caja || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.incoterm || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.tipo_material || ""}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.razon || ""}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/* Tabla 2 */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 0, color: "#1976d2", mt: 1.5 }}
            >
              Datos adicionales{" "}
            </Typography>{" "}
            <Table size="small" aria-label="articulos table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgb(0,66,105)" }}>
                  {[
                    "Temporal o definitivo",
                    "Fecha de retorno",
                    "Centro de costos",
                    "Nombre de centro de costos",
                    "Categoria",
                    "Num capex/PO",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.80rem", //aqui
                        textAlign: "center",
                        py: 0.1,
                      }}
                      align="center"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.permanente_temporal || ""}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.permanente_temporal === "Temporal"
                        ? folioRows?.fecha_retorno
                          ? new Date(
                              folioRows.fecha_retorno
                            ).toLocaleDateString("es-ES")
                          : ""
                        : "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.cost_center || ""}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.cost_center_name || ""}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.categoria || ""}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontSize: "0.78rem" }}>
                      {folioRows?.capex_po || ""}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 0, color: "#1976d2", mt: 1.5 }}
            >
              Material{" "}
            </Typography>{" "}
            <TableContainer
              component={Paper}
              elevation={6}
              sx={{
                flex: 1,
                minWidth: 340,
                backgroundColor: "#fafafa",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 0,
              }}
            >
              <Table size="small" aria-label="material table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgb(0,66,105)" }}>
                    {[
                      "#Item",
                      "#Parte",
                      "Descripcion",
                      "Cantidad",
                      "Unidad de medida",
                      "Valor unitario(USD)",
                      "Valor total(USD)",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          py: 0.25,
                        }}
                        align="center"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody
                  sx={{
                    "& .MuiTableRow-root": {
                      "& .MuiTableCell-root": {
                        py: 0.2,
                        fontSize: "0.75rem",
                      },
                    },
                  }}
                >
                  {materialRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.id || "-"}</TableCell>
                      <TableCell align="center">{row.parte || "-"}</TableCell>
                      <TableCell align="center">
                        {row.descripcion || "-"}
                      </TableCell>
                      <TableCell align="center">
                        {row.cantidad || "-"}
                      </TableCell>
                      <TableCell align="center">{row.um || "-"}</TableCell>
                      <TableCell align="center">
                        {row.unitValue || "-"}
                      </TableCell>
                      <TableCell align="center">{row.valor || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 0, color: "#1976d2", mt: 1.5 }}
            >
              Informacion de paqueteria{" "}
            </Typography>{" "}
            <TableContainer
              component={Paper}
              elevation={6}
              sx={{
                flex: 1,
                minWidth: 340,
                backgroundColor: "#fafafa",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 0,
              }}
            >
              <Table size="small" aria-label="paqueteria table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgb(0,66,105)" }}>
                    {[
                      "Pallets/cajas",
                      "Peso(Kgs por pallet/caja)",
                      "Peso(Kgs total)",
                      "Dimensiones",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          py: 0.25,
                        }}
                        align="center"
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody
                  sx={{
                    "& .MuiTableRow-root": {
                      "& .MuiTableCell-root": {
                        py: 0.2,
                        fontSize: "0.75rem",
                      },
                    },
                  }}
                >
                  {paqueteriaRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">
                        {row.pallets_cajas || "-"}
                      </TableCell>
                      <TableCell align="center">{row.peso || "-"}</TableCell>
                      <TableCell align="center">
                        {row.total_peso || "-"}
                      </TableCell>
                      <TableCell align="center">
                        {row.dimensiones || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                display: "flex",
                height: "50px",
                marginTop: "0.3cm",
                justifyContent: "flex-end",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: "10px",
                  mr: "5px",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.80rem", // 👈 título
                    fontWeight: "bold",
                  }}
                >
                  Total cantidad:
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.78rem", // 👈 valor
                  }}
                >
                  {folioRows?.total_cantidad || ""}
                </Typography>
              </Paper>

              <Paper
                elevation={3}
                sx={{ p: "10px", mr: "5px", textAlign: "center" }}
              >
                <Typography sx={{ fontSize: "0.80rem", fontWeight: "bold" }}>
                  Total pallets/cajas:
                </Typography>
                <Typography sx={{ fontSize: "0.78rem" }}>
                  {folioRows?.total_pallets_cajas || ""}
                </Typography>
              </Paper>

              <Paper
                elevation={3}
                sx={{ p: "10px", mr: "5px", textAlign: "center" }}
              >
                <Typography sx={{ fontSize: "0.80rem", fontWeight: "bold" }}>
                  Total Peso:
                </Typography>
                <Typography sx={{ fontSize: "0.78rem" }}>
                  {folioRows?.total_peso || ""}
                </Typography>
              </Paper>

              <Paper
                elevation={3}
                sx={{ p: "10px", mr: "5px", textAlign: "center" }}
              >
                <Typography sx={{ fontSize: "0.80rem", fontWeight: "bold" }}>
                  Total Valor:
                </Typography>
                <Typography sx={{ fontSize: "0.78rem" }}>
                  {folioRows?.total_valor || ""}
                </Typography>
              </Paper>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 0, color: "#1976d2", mt: 1.5 }}
              >
                Informacion de aprobadores
              </Typography>
              {/* Enviado por 1 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "0.3cm",
                  gap: "8px",
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography sx={{ fontSize: "0.77rem", minWidth: "100px" }}>
                    Enviado por:
                  </Typography>
                  <TextField
                    name="Enviado por"
                    variant="standard"
                    value={folioRows?.creado_por || ""}
                    InputProps={{
                      readOnly: true,

                      sx: { fontSize: "0.78rem" },
                    }}
                    sx={{ width: "230px" }}
                  />
                </Box>
              </div>
              {/* Aprobador 1 */}
              <Box display="flex" alignItems="center" gap={1}>
                <Typography sx={{ fontSize: "0.77rem", minWidth: "100px" }}>
                  Aprobador 1:
                </Typography>
                <TextField
                  name="responsable1"
                  variant="standard"
                  value={folioRows?.responsable1 || ""}
                  InputProps={{
                    readOnly: true,

                    sx: { fontSize: "0.78rem" },
                  }}
                  sx={{ width: "235px" }}
                />
                {espera.ap1 && <HourglassBottomTwoToneIcon />}
                {rechazado.ap1 && <CancelTwoToneIcon color="error" />}
                {aprobado.ap1 && <CheckCircleIcon color="success" />}
              </Box>

              {/* Suplente */}
              <Box display="flex" alignItems="center" gap={1}>
                {/* Label a la izquierda */}
                <Typography sx={{ fontSize: "0.77rem", minWidth: "100px" }}>
                  Suplente:
                </Typography>

                {/* Campo sin label */}
                <TextField
                  name="suplente"
                  variant="standard"
                  value={folioRows?.suplente || ""}
                  InputProps={{
                    readOnly: true,

                    sx: { fontSize: "0.78rem" },
                  }}
                  sx={{ width: "235px" }}
                />

                {/* Íconos de estado */}
                {espera.sup && <HourglassBottomTwoToneIcon />}
                {rechazado.sup && <CancelTwoToneIcon color="error" />}
                {aprobado.sup && <CheckCircleIcon color="success" />}
              </Box>

              {/* Aprobador 2 + Botones */}
              <Box display="flex" alignItems="center" gap={1}>
                {/* Aprobador 2 */}
                <Typography sx={{ fontSize: "0.77rem", minWidth: "100px" }}>
                  Aprobador 2:
                </Typography>
                <TextField
                  name="responsable2"
                  variant="standard"
                  value={folioRows?.responsable2 || ""}
                  InputProps={{ readOnly: true, sx: { fontSize: "0.78rem" } }}
                  sx={{ width: "235px" }}
                />
                {espera.ap2 && <HourglassBottomTwoToneIcon />}
                {rechazado.ap2 && <CancelTwoToneIcon color="error" />}
                {aprobado.ap2 && <CheckCircleIcon color="success" />}

                {/* Recibido por */}
                <Typography
                  sx={{
                    fontSize: "0.77rem",
                    minWidth: "100px",
                    marginLeft: "14em",
                  }}
                >
                  Recibido por:
                </Typography>
                <TextField
                  name="recibidoPor"
                  variant="standard"
                  value={""}
                  InputProps={{ readOnly: true, sx: { fontSize: "0.78rem" } }}
                  sx={{ width: "225px" }}
                />
              </Box>
            </div>{" "}
          </div>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={handleDownloadPDF}
            >
              Descargar PDF
            </Button>

            {ocultar && (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleClickAprobar}
              >
                Aprobar
              </Button>
            )}

            {ocultar && (
              <Button
                variant="contained"
                color="error"
                size="medium"
                onClick={handleClickRechazar}
              >
                Rechazar
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          mt: "1cm",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Mensaje
        mensaje={mensaje}
        estado={estado}
        open={openError}
        onClose={() => setOpenError(false)}
      />
    </div>
  );
}

export default Visualizar;
