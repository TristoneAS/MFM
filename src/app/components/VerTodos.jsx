"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Tabs, Tab } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import { useRouter } from "next/navigation";

import Visualizar from "./Visualizar";
function VerTodos() {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin !== "true") {
      router.push("/");
    }
  }, []);
  const [rows, setRows] = useState([]);
  const [idSelected, setIdSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [folioRows, setFolioRows] = useState([]);
  const [materialRows, setMaterialRows] = useState([]);
  const [paqueteriaRows, setPaqueteriaRows] = useState([]);
  const renderEstadoCell = (estado) => {
    let icon = null;
    let color = "";

    switch (estado) {
      case "NA":
        icon = <BrowserNotSupportedIcon sx={{ color: "#cdcdccff" }} />;
        color = "#cdcdccff";
        break;
      case "Pendiente":
        icon = <HourglassBottomTwoToneIcon sx={{ color: "#ffb74d" }} />;
        color = "#ffb74d";
        break;
      case "Aprobado":
        icon = <CheckCircleIcon sx={{ color: "#81c784" }} />;
        color = "#81c784";
        break;
      case "Rechazado":
        icon = <CancelTwoToneIcon sx={{ color: "#FF6A6A" }} />;
        color = "#FF6A6A";
        break;
      default:
        icon = null;
        color = "#999";
    }

    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%", // ocupa todo el ancho de la celda
          height: "100%", // ocupa todo el alto de la celda
          color,
        }}
      >
        {icon}
      </span>
    );
  };

  const columns = [
    {
      field: "acciones",
      headerName: "Acción",
      flex: 0.8,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;

        return (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleClickVerFolio(row.folio_id)}
              style={{
                marginLeft: 4,
                minWidth: "36px",
                padding: "4px",
              }}
            >
              <VisibilityIcon fontSize="small" />
            </Button>
          </>
        );
      },
    },
    {
      field: "folio_id",
      headerName: "Folio",
      flex: 0.3,
      align: "center",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "creado_por",
      headerName: "Requisitor",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "responsable1",
      headerName: "Aprobador",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status_1",
      headerName: "Estado",
      flex: 0.9,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => renderEstadoCell(params.value),
    },
    {
      field: "suplente",
      headerName: "Suplente",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status_S",
      headerName: "Estado",
      flex: 0.9,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => renderEstadoCell(params.value),
    },
    {
      field: "responsable2",
      headerName: "Aprobador 2",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status_2",
      headerName: "Estado",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => renderEstadoCell(params.value),
    },
    {
      field: "estado_retorno",
      headerName: "Dias Restantes",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const row = params.row;
        const dias = row.dias_restantes; // viene de tu consulta SQL
        const estado = row.estado_retorno; // el estado calculado por SQL
        const liberado = row.liberado; // tu campo de la base de datos
        const fecha_regreso = row.fecha_regreso;
        // Caso especial: si está liberado
        if (liberado === "true") {
          return (
            <span
              style={{
                backgroundColor: "#4db6ac", // color azul-verde para liberado
                color: "#fff",
                padding: "6px 10px",
                borderRadius: "4px",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
                display: "flex",
                flexDirection: "column", // 👈 apilar en columna
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1.3",
              }}
            >
              <span>Retornado</span>
              <span style={{ fontSize: "0.9em", fontWeight: "normal" }}>
                {fecha_regreso}
              </span>
            </span>
          );
        }

        // Caso especial: si no hay días restantes -> mostrar N/A
        if (dias === null) {
          return (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
              }}
            >
              N/A
            </span>
          );
        }
        if (dias < -1000) {
          return (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
              }}
            >
              N/A
            </span>
          );
        }
        // Determinar color según estado
        let color = "";
        let textColor = "#000";

        switch (estado) {
          case "Vencido":
            color = "#FF6A6A"; // rojo
            textColor = "#fff";
            break;
          case "Hoy":
            color = "#ffb74d"; // naranja
            textColor = "#fff";
            break;
          case "Próximos 5 días":
            color = "#fff176"; // amarillo
            textColor = "#000";
            break;
          default:
            color = "#81c784"; // verde
            textColor = "#fff";
        }

        return (
          <span
            style={{
              backgroundColor: color,
              color: textColor,
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {dias}
          </span>
        );
      },
    },
  ];
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [res1] = await Promise.all([
          axios.get(`/api/folio_consultas/?vertodo=true`),
        ]);
        if (!isMounted) return;

        setRows(res1.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  const handleClickVerFolio = async (folio_id) => {
    let isMounted = true;
    try {
      const [folioRes, materialRes, paqueteriaRes] = await Promise.all([
        axios.get(`/api/folio_consultas/?folio_id=${folio_id}`),
        axios.get(`/api/material_consultas/?folio_id=${folio_id}`),
        axios.get(`/api/paqueteria/?folio_id=${folio_id}`),
      ]);
      if (!isMounted) return;

      setFolioRows(folioRes.data[0] || []);
      setMaterialRows(materialRes.data || []);
      setPaqueteriaRows(paqueteriaRes.data || []);
      setOpenVisualizar(true);
    } catch (err) {
      console.error("Error al obtener folio:", err);
    }
  };
  const handleClickRow = (params) => {
    setIdSelected(params.id);
  };
  if (loading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // opcional
        width: "100vw", // 100vw - 5% izq - 5% der = 90vw
        height: "90vh",
        background: "rgb(255,255,255)",
        borderRadius: "3px",
      }}
    >
      {" "}
      <div
        style={{ display: "flex", height: "80vh", width: "95%", mt: "20cm" }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          autoPageSize
          rowsPerPageOptions={[5]}
          onRowClick={handleClickRow}
          getRowId={(row) => row.folio_id}
          disableSelectionOnClick
          sx={{
            fontSize: "0.7rem",
            "& .MuiDataGrid-cell": { padding: "4px" },
            "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" },
          }}
        />
      </div>
      <Visualizar
        open={openVisualizar}
        setOpen={setOpenVisualizar}
        folioRows={folioRows}
        materialRows={materialRows}
        paqueteriaRows={paqueteriaRows}
        ocultar={false}
        idSelected={idSelected}
        setRows={setRows}
      />
    </div>
  );
}

export default VerTodos;
