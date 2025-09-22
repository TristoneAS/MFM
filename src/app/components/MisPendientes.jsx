"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Tabs, Tab } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Visualizar from "./Visualizar";

// ---------------- Custom Tab Panel ----------------
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// ---------------- Main Component ----------------
export default function MisPendientes() {
  const [emp_id, setEmp_id] = useState(null);
  const [rowsRevisar, setRowsRevisar] = useState([]);
  const [rowsRechazados, setRowsRechazados] = useState([]);
  const [rowsAprobados, setRowsAprobados] = useState([]);
  const [roswRetornados, setRowsRetornados] = useState([]);
  const [rowsTemporales, setRowsTemporales] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [folioRows, setFolioRows] = useState([]);
  const [materialRows, setMaterialRows] = useState([]);
  const [paqueteriaRows, setPaqueteriaRows] = useState([]);
  const [idSelected, setIdSelected] = useState(null);

  const [value, setValue] = useState(0);
  const [ocultarBoton, setOcultarBoton] = useState(false);

  // ---------------- Fetch emp_id ----------------
  useEffect(() => {
    const stored = localStorage.getItem("emp_id");
    if (stored) setEmp_id(stored);
  }, []);

  // ---------------- Fetch Data ----------------
  useEffect(() => {
    if (!emp_id) return;
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [revisar, temporales] = await Promise.all([
          axios.get(`/api/folio_consultas/?emp_id=${emp_id}&Revisar=true`),
          axios.get(`/api/folio_consultas/?emp_id=${emp_id}&retornos=true`),
        ]);

        if (!isMounted) return;

        setRowsRevisar(revisar.data);
        setRowsTemporales(temporales.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [emp_id]);

  // ---------------- Handlers ----------------
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
    setOcultarBoton(true);
  };
  const handleClickRowTemporales = (params) => {
    setIdSelected(params.id);
    setOcultarBoton(false);
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
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

  // ---------------- Columns ----------------
  const columns = [
    {
      field: "acciones",
      headerName: "Acción",
      flex: 0.8,
      sortable: false,
      filterable: false,
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
    { field: "folio_id", headerName: "Folio", flex: 0.3, align: "center" },
    { field: "fecha", headerName: "Fecha", flex: 1 },
    { field: "creado_por", headerName: "Requisitor", flex: 2 },
    { field: "responsable1", headerName: "Aprobador", flex: 2 },
    {
      field: "status_1",
      headerName: "Estado",
      flex: 0.9,
      renderCell: (params) => renderEstadoCell(params.value),
    },
    { field: "suplente", headerName: "Suplente", flex: 2 },
    {
      field: "status_S",
      headerName: "Estado",
      flex: 0.9,
      renderCell: (params) => renderEstadoCell(params.value),
    },
    { field: "responsable2", headerName: "Aprobador 2", flex: 2 },
    {
      field: "status_2",
      headerName: "Estado",
      flex: 1,
      renderCell: (params) => renderEstadoCell(params.value),
    },
    {
      field: "estado_retorno",
      headerName: "Dias Restantes",
      flex: 1.5,
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
  const renderEstadoCell = (estado) => {
    let icon = null;
    let color = "";

    switch (estado) {
      case "NA":
        icon = <BrowserNotSupportedIcon style={{ color: "#cdcdccff" }} />;
        color = "#cdcdccff";
        break;
      case "Pendiente":
        icon = <HourglassBottomTwoToneIcon style={{ color: "#ffb74d" }} />;
        color = "#ffb74d";
        break;
      case "Aprobado":
        icon = <CheckCircleIcon style={{ color: "#81c784" }} />;
        color = "#81c784";
        break;
      case "Rechazado":
        icon = <CancelTwoToneIcon style={{ color: "#FF6A6A" }} />;
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
          fontWeight: "bold",
          color,
          justifyContent: "center",
        }}
      >
        {icon}
        {/*   <span style={{ marginLeft: 6 }}>{estado}</span> */}
      </span>
    );
  };
  const columnsTemporales = [
    {
      field: "acciones",
      headerName: "Acción",
      flex: 1.25,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        const isResp2 =
          row.responsable2_id === emp_id ||
          row.responsable1_id === emp_id ||
          row.suplente_id === emp_id;

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

            {isResp2 && (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleLiberarRegistro(row.folio_id)}
                style={{
                  marginLeft: 4,
                  minWidth: "36px",
                  padding: "4px",
                  backgroundColor: "#81c784", // verde
                  color: "#fff",
                }}
              >
                <LockOpenIcon fontSize="small" />
              </Button>
            )}
          </>
        );
      },
    },
    { field: "folio_id", headerName: "Folio", flex: 0.3, align: "center" },
    { field: "fecha", headerName: "Fecha", flex: 0.9 },
    { field: "fecha_retorno", headerName: "Retorno", flex: 0.9 },
    { field: "creado_por", headerName: "Requisitor", flex: 2.8 },
    { field: "responsable1", headerName: "Aprobador", flex: 2.8 },
    {
      field: "status_1",
      headerName: "Estado",
      flex: 0.7,
      renderCell: (params) => renderEstadoCell(params.value),
    },
    { field: "suplente", headerName: "Suplente", flex: 2.8 },
    {
      field: "status_S",
      headerName: "Estado",
      flex: 0.7,
      renderCell: (params) => renderEstadoCell(params.value),
    },
    { field: "responsable2", headerName: "Aprobador 2", flex: 2.8 },
    {
      field: "status_2",
      headerName: "Estado",
      flex: 0.7,
      renderCell: (params) => renderEstadoCell(params.value),
    },

    {
      field: "estado_retorno",
      headerName: "Dias Restantes",
      flex: 1.45,
      renderCell: (params) => {
        console.log("los params son: ", params);

        const row = params.row;
        const estado = params.value;
        const dias = row.dias_restantes; // viene de tu consulta SQL

        // Caso especial: si no hay días restantes -> mostrar N/A sin color
        if (dias === null) {
          return (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
                display: "inline-block",
                color: "#555", // gris neutro
              }}
            >
              N/A
            </span>
          );
        }

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
              display: "inline-block",
            }}
          >
            {` ${dias}`}
          </span>
        );
      },
    },
  ];

  const StylePestañas = { fontSize: "12px" };

  const handleLiberarRegistro = async (folio_id) => {
    try {
      const emp_id = localStorage.getItem("emp_id");

      if (!folio_id) {
        console.log("Selecciona un folio");
        return;
      }

      // Confirmación antes de continuar
      const confirmar = window.confirm(
        "¿Seguro que quieres liberar este folio?"
      );
      if (!confirmar) return;

      setLoading(true);
      const hoy = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      await axios.put(`/api/folio/${folio_id}`, {
        liberar: "true",
        fecha_regreso: hoy,
        emp_id: emp_id,
      });

      const res = await axios.get(
        `/api/folio_consultas/?emp_id=${emp_id}&retornos=true`
      );

      setRowsTemporales(res.data);
      Advertencia(folio_id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      <Box
        style={{
          display: "flex",
          height: "85vh",
          width: "95%",
          mt: "20cm",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs value={value} onChange={handleChangeTab}>
            <Tab label="Aprobar" {...a11yProps(0)} sx={StylePestañas} />
            <Tab label="Retornar" {...a11yProps(1)} sx={StylePestañas} />
            <Tab
              label="Aprobados por mi"
              {...a11yProps(2)}
              sx={StylePestañas}
            />{" "}
            <Tab
              label="Rechazados por mi"
              {...a11yProps(3)}
              sx={StylePestañas}
            />{" "}
            <Tab
              label="Retornados por mi"
              {...a11yProps(4)}
              sx={StylePestañas}
            />
          </Tabs>
        </Box>

        {/* DataGrid Aprobados */}

        <CustomTabPanel value={value} index={0}>
          <div style={{ height: 400, width: "100%" }}>
            <div
              style={{
                display: "flex",
                height: "75vh",
                width: "100%",
                mt: "20cm",
              }}
            >
              <DataGrid
                rows={rowsRevisar}
                columns={columns}
                pageSize={5}
                autoPageSize
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.folio_id}
                onRowClick={handleClickRow}
                disableSelectionOnClick
                sx={{
                  fontSize: "0.7rem",
                  "& .MuiDataGrid-cell": { padding: "4px" },
                  "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" },
                }}
              />
            </div>
          </div>
        </CustomTabPanel>

        {/* DataGrid Rechazados */}
        <CustomTabPanel value={value} index={1}>
          <div style={{ height: 400, width: "100%" }}>
            <div
              style={{
                display: "flex",
                height: "75vh",
                width: "100%",
                mt: "20cm",
              }}
            >
              <DataGrid
                rows={rowsTemporales}
                columns={columnsTemporales}
                pageSize={5}
                autoPageSize
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.folio_id}
                onRowClick={handleClickRowTemporales}
                disableSelectionOnClick
                sx={{
                  fontSize: "0.7rem",
                  "& .MuiDataGrid-cell": { padding: "4px" },
                  "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" },
                }}
              />
            </div>
          </div>
        </CustomTabPanel>
        {/* DataGrid Salidas temporales */}
        <CustomTabPanel value={value} index={2}>
          <div style={{ height: 400, width: "100%" }}>
            <div
              style={{
                display: "flex",
                height: "75vh",
                width: "100%",
                mt: "20cm",
              }}
            >
              <DataGrid
                rows={rowsAprobados}
                columns={columns}
                pageSize={5}
                autoPageSize
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.folio_id}
                onRowClick={handleClickRow}
                disableSelectionOnClick
                sx={{
                  fontSize: "0.7rem",
                  "& .MuiDataGrid-cell": { padding: "4px" },
                  "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" },
                }}
              />
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <div style={{ height: 400, width: "100%" }}>
            <div
              style={{
                display: "flex",
                height: "75vh",
                width: "100%",
                mt: "20cm",
              }}
            >
              <DataGrid
                rows={rowsRechazados}
                columns={columns}
                pageSize={5}
                autoPageSize
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.folio_id}
                onRowClick={handleClickRowTemporales}
                disableSelectionOnClick
                sx={{
                  fontSize: "0.7rem",
                  "& .MuiDataGrid-cell": { padding: "4px" },
                  "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" },
                }}
              />
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <div style={{ height: 400, width: "100%" }}>
            <div
              style={{
                display: "flex",
                height: "75vh",
                width: "100%",
                mt: "20cm",
              }}
            >
              <DataGrid
                rows={roswRetornados}
                columns={columns}
                pageSize={5}
                autoPageSize
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.folio_id}
                onRowClick={handleClickRowTemporales}
                disableSelectionOnClick
                sx={{
                  fontSize: "0.7rem",
                  "& .MuiDataGrid-cell": { padding: "4px" },
                  "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" },
                }}
              />
            </div>
          </div>
        </CustomTabPanel>
        {/* Modal Visualizar */}
        <Visualizar
          open={openVisualizar}
          setOpen={setOpenVisualizar}
          folioRows={folioRows}
          materialRows={materialRows}
          paqueteriaRows={paqueteriaRows}
          ocultar={ocultarBoton}
          idSelected={idSelected}
          setRows={setRowsRevisar}
        />
      </Box>
    </div>
  );
}
