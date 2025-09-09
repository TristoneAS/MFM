"use client";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Visualizar from "./Visualizar";
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
function Aprobaciones() {
  //********************************* */
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [folioRows, setFolioRows] = useState([]);
  const [materialRows, setMaterialRows] = useState([]);
  const [paqueteriaRows, setPaqueteriaRows] = useState([]);
  const [ocultarBoton, setOcultarBoton] = useState(false);

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
  //*******************Esperando aprobacion ************/
  const [rowsEsperando, setRowsEsperando] = useState([]);
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
    { field: "fecha", headerName: "Fecha", flex: 0.75, editable: false },
    {
      field: "responsable1",
      headerName: "Aprobador",
      flex: 2,
      editable: false,
    },
    { field: "status_1", headerName: "Estado", flex: 0.7, editable: false },
    { field: "suplente", headerName: "Suplente", flex: 2, editable: false },
    { field: "status_S", headerName: "Estado", flex: 0.7, editable: false },
    {
      field: "responsable2",
      headerName: "Aprobador 2",
      flex: 2,
      editable: false,
    },
    { field: "status_2", headerName: "Estado", flex: 0.7, editable: false },
  ];

  //******************************* */
  const [emp_id, setEmp_id] = useState(null);
  const [idSelected, setIdSelected] = useState(null);
  useEffect(() => {
    const emp_id_value = localStorage.getItem("emp_id");
    setEmp_id(emp_id_value);
  }, []);

  const [rows, setRows] = useState([]);
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
    { field: "status_1", headerName: "Estado", flex: 0.9 },
    { field: "suplente", headerName: "Suplente", flex: 2 },
    { field: "status_S", headerName: "Estado", flex: 0.9 },
    { field: "responsable2", headerName: "Aprobador 2", flex: 2 },
    { field: "status_2", headerName: "Estado", flex: 1 },
  ];

  useEffect(() => {
    if (!emp_id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/folio_consultas/?emp_id=${emp_id}`);
        setRows(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Error al obtener artículos:", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          });
        } else {
          console.error("Error desconocido:", err);
        }
      }
    };
    const fetchData2 = async () => {
      try {
        const res = await axios.get(
          `/api/folio_consultas_create_by/?emp_id=${emp_id}`
        );
        setRowsEsperando(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Error al obtener informacion:", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          });
        } else {
          console.error("Error desconocido:", err);
        }
      }
    };
    fetchData();
    fetchData2();
  }, [emp_id]);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClickRow = async (params) => {
    setIdSelected(params.id);
    setOcultarBoton(true);
  };
  const handleClickRowEsperando = async (params) => {
    setOcultarBoton(false);
    setIdSelected(params.id);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        // width: "100%",
        marginLeft: "6cm",
        marginRight: "5.5cm",
        marginTop: "1cm",
        background: "rgb(250,250,250)",

        height: "33rem",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Esperando aprobacion..."
              {...a11yProps(0)}
              sx={StylePestañas}
            />
            <Tab label="Aprobar " {...a11yProps(1)} sx={StylePestañas} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={1}>
          <div style={{ height: 400, width: "100%" }}>
            {
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                autoPageSize
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.folio_id}
                onRowClick={(params) => handleClickRow(params)}
                disableSelectionOnClick
                sx={{
                  fontSize: "0.7rem", // 👈 ajusta el tamaño de fuente general
                  "& .MuiDataGrid-cell": {
                    padding: "4px", // 👈 reduce padding de celdas
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    fontSize: "0.85rem", // 👈 tamaño encabezados
                  },
                }}
              />
            }
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={0}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rowsEsperando}
              columns={columnsEsperando}
              pageSize={5}
              autoPageSize
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.folio_id}
              onRowClick={(params) => handleClickRowEsperando(params)}
              disableSelectionOnClick
              sx={{
                fontSize: "0.7rem", // 👈 ajusta el tamaño de fuente general
                "& .MuiDataGrid-cell": {
                  padding: "4px", // 👈 reduce padding de celdas
                },
                "& .MuiDataGrid-columnHeaders": {
                  fontSize: "0.85rem", // 👈 tamaño encabezados
                },
              }}
            />
          </div>
        </CustomTabPanel>
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
const StylePestañas = {
  fontSize: "12px",
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "0.5rem",
};
export default Aprobaciones;
