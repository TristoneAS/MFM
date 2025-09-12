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
export default function Aprobaciones() {
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
  // ---------------- States ----------------
  const [emp_id, setEmp_id] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsEsperando, setRowsEsperando] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [folioRows, setFolioRows] = useState([]);
  const [materialRows, setMaterialRows] = useState([]);
  const [paqueteriaRows, setPaqueteriaRows] = useState([]);
  const [idSelected, setIdSelected] = useState(null);
  const [ocultarBoton, setOcultarBoton] = useState(false);

  const [value, setValue] = useState(0);

  // ---------------- Fetch emp_id desde localStorage ----------------
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
        const [res1, res2] = await Promise.all([
          axios.get(`/api/folio_consultas/?emp_id=${emp_id}`),
          axios.get(`/api/folio_consultas_create_by/?emp_id=${emp_id}`),
        ]);
        if (!isMounted) return;

        setRows(res1.data);
        setRowsEsperando(res2.data);
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

  const handleClickRowEsperando = (params) => {
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
      headerName: "Accion",
      flex: 0.9,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleClickVerFolio(params.row.folio_id)}
        >
          <VisibilityIcon />
        </Button>
      ),
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
  ];

  const columnsEsperando = [
    {
      field: "acciones",
      headerName: "Accion",
      flex: 0.7,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleClickVerFolio(params.row.folio_id)}
        >
          <VisibilityIcon />
        </Button>
      ),
    },
    { field: "folio_id", headerName: "Folio", flex: 0.5, align: "center" },
    { field: "fecha", headerName: "Fecha", flex: 0.75 },
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
  ];

  // ---------------- Styles ----------------
  const StylePestañas = { fontSize: "12px" };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginLeft: "6cm",
        marginRight: "5.5cm",
        marginTop: "1cm",
        background: "rgb(255,255,255)",
        height: "33rem",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChangeTab}>
            <Tab
              label="Esperando aprobacion..."
              {...a11yProps(0)}
              sx={StylePestañas}
            />
            <Tab label="Aprobar" {...a11yProps(1)} sx={StylePestañas} />
          </Tabs>
        </Box>

        {/* DataGrid para Aprobar */}
        <CustomTabPanel value={value} index={1}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
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
        </CustomTabPanel>

        {/* DataGrid para Esperando */}
        <CustomTabPanel value={value} index={0}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rowsEsperando}
              columns={columnsEsperando}
              pageSize={5}
              autoPageSize
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.folio_id}
              onRowClick={handleClickRowEsperando}
              disableSelectionOnClick
              sx={{
                fontSize: "0.7rem",
                "& .MuiDataGrid-cell": { padding: "4px" },
                "& .MuiDataGrid-columnHeaders": { fontSize: "0.85rem" },
              }}
            />
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
          setRows={setRows}
        />
      </Box>
    </div>
  );
}
