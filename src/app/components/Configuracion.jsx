"use client";
import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Typography, Card } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/navigation";

import TextField from "@mui/material/TextField";
import Mensaje from "./Mensaje";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import {
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Update } from "@mui/icons-material";
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

function Configuracion() {
  const [admin, setAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin !== "true") {
      router.push("/");
    }
  }, []);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef(null);
  const [openError, setOpenError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("error"); // success, error, warning, info

  const Advertencia = () => {
    setMensaje("Debes llenar todos los datos");
    setEstado("warning");
    setOpenError(true);
  };
  const Success = (title) => {
    setMensaje(title + "guardado correctamente");
    setEstado("success");
    setOpenError(true);
  };
  const Delete = (title) => {
    setMensaje(title + "ha sido eliminado");
    setEstado("error");
    setOpenError(true);
  };
  const update = (title) => {
    setMensaje(title + "actualizado correctamente");
    setEstado("success");
    setOpenError(true);
  };
  //CostCenter
  const [rowsCostCenter, setRowsCostCenter] = React.useState([]);
  const columnsCostCenter = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "cost_center",
      headerName: "Cost Center",
      width: 300,
      editable: true,
    },
    {
      field: "cost_center_name",
      headerName: "Cost Center Name",
      width: 300,
      editable: true,
    },
  ];
  //Estados de los botones
  const [btnAddCostCenter, setBtnAddCostCenter] = useState(false);
  const [btnDeleteCostCenter, setBtnDeleteCostCenter] = useState(true);
  const [btnSaveCostCenter, setBtnSaveCostCenter] = useState(true);
  //Eliminar o actualizar
  const [idSelectedCostCenter, setIdSelectedCostCenter] = useState(null);

  const handleAddRowCostCenter = async () => {
    setBtnAddCostCenter(true);
    setBtnDeleteCostCenter(true);
    setBtnSaveCostCenter(false);
    let inicio = 1;
    try {
      const res = await axios.get("/api/costcenter/");

      if (res.data.length > 0) {
        const lastId = res.data[res.data.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }

      const newRow = { id: inicio, cost_center: "", cost_center_name: "" };
      setRowsCostCenter((prev) => [newRow, ...prev]);
      setCostCenter({ id: "", cost_center: "", cost_center_name });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const [costCenter, setCostCenter] = useState({
    id: "",
    cost_center: "",
    cost_center_name: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/costcenter/");
        setRowsCostCenter(res.data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarCostCenter = async () => {
    try {
      if (
        costCenter.cost_center.trim() === "" ||
        costCenter.cost_center_name.trim() === ""
      ) {
        Advertencia();
      } else {
        const buscar = await axios.get(
          `/api/costcenter/?id=${idSelectedCostCenter}`
        );
        if (buscar.data.length > 0) {
          await axios.put(
            `/api/costcenter/${idSelectedCostCenter}`,
            costCenter
          );
          update("Cost Center ");
        } else {
          await axios.post("/api/costcenter/", costCenter);
          const res2 = await axios.get("/api/costcenter/");
          setRowsCostCenter(res2.data);
          setBtnAddCostCenter(false);
          setBtnDeleteCostCenter(true);
          setBtnSaveCostCenter(true);
          Success("Cost Center ");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteCostCenter = async (params) => {
    if (idSelectedCostCenter !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelectedCostCenter}?`)) {
          const res = await axios.delete(
            `/api/costcenter/${idSelectedCostCenter}`
          );
          Delete(costCenter.cost_center + " ");
          const res2 = await axios.get("/api/costcenter/");
          setRowsCostCenter(res2.data);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };
  const handleClickRowCostCenter = async (params) => {
    setCostCenter({
      cost_center: params.row.cost_center,
      cost_center_name: params.row.cost_center_name,
    });

    setIdSelectedCostCenter(params.id);
  };

  useEffect(() => {
    const updateButtons = async () => {
      try {
        const buscar = await axios.get(
          `/api/costcenter/?id=${idSelectedCostCenter}`
        );
        console.log(buscar);

        if (buscar.data.length > 0) {
          for (const rowtest of rowsCostCenter) {
            console.log(
              `ID: ${rowtest.id}, cost_center: ${rowtest.cost_center}`
            );
            if (rowtest.cost_center.trim() === "") {
              setBtnAddCostCenter(true);
              break;
            } else {
              setBtnAddCostCenter(false);
            }
          }

          setBtnDeleteCostCenter(false);
          setBtnSaveCostCenter(false);
        } else {
          setBtnAddCostCenter(true);
          setBtnDeleteCostCenter(true);
          setBtnSaveCostCenter(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (idSelectedCostCenter !== null) {
      updateButtons();
    }
  }, [idSelectedCostCenter]); // Escucha cambios en `idSelected`

  const handleRowUpdateCostCenter = (updatedRow) => {
    setCostCenter({
      cost_center: updatedRow.cost_center,
      cost_center_name: updatedRow.cost_center_name,
    });
    setRowsCostCenter((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  //******************************************************* */
  //Transportista
  const [rows, setRows] = React.useState([]);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "transportista",
      headerName: "Transportista",
      width: 500,
      editable: true,
    },
  ];
  //Estados de los botones
  const [btnAdd, setBtnAdd] = useState(false);
  const [btnDelete, setBtnDelete] = useState(true);
  const [btnSave, setBtnSave] = useState(true);
  //Eliminar o actualizar
  const [idSelected, setIdSelected] = useState(null);

  const handleAddRow = async () => {
    setBtnAdd(true);
    setBtnDelete(true);
    setBtnSave(false);
    let inicio = 1;
    try {
      const res = await axios.get("/api/transportista/");

      if (res.data.length > 0) {
        const lastId = res.data[res.data.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }

      const newRow = { id: inicio, transportista: "" };
      setRows((prev) => [newRow, ...prev]);
      setTransportista({ id: "", transportista: "" });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const [transportista, setTransportista] = useState({
    id: "",
    transportista: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/transportista/");
        setRows(res.data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarTransportista = async () => {
    try {
      if (transportista.transportista.trim() === "") {
        Advertencia();
      } else {
        const buscar = await axios.get(`/api/transportista/?id=${idSelected}`);
        if (buscar.data.length > 0) {
          await axios.put(`/api/transportista/${idSelected}`, transportista);
          update("Transportista ");
        } else {
          await axios.post("/api/transportista/", transportista);
          const res2 = await axios.get("/api/transportista/");
          setRows(res2.data);
          setBtnAdd(false);
          setBtnDelete(true);
          setBtnSave(true);
          Success("Transportista ");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTransportista = async (params) => {
    if (idSelected !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelected}?`)) {
          const res = await axios.delete(`/api/transportista/${idSelected}`);
          Delete(transportista.transportista + " ");
          const res2 = await axios.get("/api/transportista/");
          setRows(res2.data);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };
  const handleClickRowTransportista = async (params) => {
    setTransportista({
      transportista: params.row.transportista,
    });

    setIdSelected(params.id);
  };

  useEffect(() => {
    const updateButtons = async () => {
      try {
        const buscar = await axios.get(`/api/transportista/?id=${idSelected}`);
        if (buscar.data.length > 0) {
          for (const rowtest of rows) {
            console.log(
              `ID: ${rowtest.id}, Transportista: ${rowtest.transportista}`
            );
            if (rowtest.transportista.trim() === "") {
              setBtnAdd(true);
              break;
            } else {
              setBtnAdd(false);
            }
          }

          setBtnDelete(false);
          setBtnSave(false);
          console.log("test ", rows);
        } else {
          setBtnAdd(true);
          setBtnDelete(true);
          setBtnSave(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (idSelected !== null) {
      updateButtons();
    }
  }, [idSelected]); // Escucha cambios en `idSelected`

  const handleRowUpdate = (updatedRow) => {
    setTransportista({
      transportista: updatedRow.transportista,
    });
    setRows((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  //******************************************************* */
  //Modo de envio
  const [rowsEnvio, setRowsEnvio] = React.useState([]);
  const columnsEnvio = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "modo_envio",
      headerName: "Envio",
      width: 500,
      editable: true,
    },
  ];
  //Estados de los botones
  const [btnAddEnvio, setBtnAddEnvio] = useState(false);
  const [btnDeleteEnvio, setBtnDeleteEnvio] = useState(true);
  const [btnSaveEnvio, setBtnSaveEnvio] = useState(true);
  //Eliminar o actualizar
  const [idSelectedEnvio, setIdSelectedEnvio] = useState(null);

  const handleAddRowEnvio = async () => {
    setBtnAddEnvio(true);
    setBtnDeleteEnvio(true);
    setBtnSaveEnvio(false);
    let inicio = 1;
    try {
      const res = await axios.get("/api/envio/");

      if (res.data.length > 0) {
        const lastId = res.data[res.data.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }

      const newRowEnvio = { id: inicio, modo_envio: "" };
      setRowsEnvio((prevEnvio) => [newRowEnvio, ...prevEnvio]);
      setEnvio({ id: "", modo_envio: "" });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const [modo_envio, setEnvio] = useState({
    id: "",
    modo_envio: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/envio/");
        setRowsEnvio(res.data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarEnvio = async () => {
    try {
      if (modo_envio.modo_envio.trim() === "") {
        Advertencia();
      } else {
        const buscar = await axios.get(`/api/envio/?id=${idSelectedEnvio}`);
        if (buscar.data.length > 0) {
          await axios.put(`/api/envio/${idSelectedEnvio}`, modo_envio);
          update("Envio ");
        } else {
          await axios.post("/api/envio/", modo_envio);
          const res2 = await axios.get("/api/envio/");
          setRowsEnvio(res2.data);
          setBtnAddEnvio(false);
          setBtnDeleteEnvio(true);
          setBtnSaveEnvio(true);
          Success("Envio ");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteEnvio = async () => {
    if (idSelectedEnvio !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelectedEnvio}?`)) {
          const res = await axios.delete(`/api/envio/${idSelectedEnvio}`);
          Delete(modo_envio.modo_envio + " ");
          const res2 = await axios.get("/api/envio/");
          setRowsEnvio(res2.data);
        }
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    }
  };
  const handleClickRowEnvio = async (params) => {
    console.log("los params es: " + params.row.modo_envio);

    setEnvio({
      modo_envio: params.row.modo_envio,
    });

    setIdSelectedEnvio(params.id);
  };

  useEffect(() => {
    const updateButtons = async () => {
      try {
        const buscar = await axios.get(`/api/envio/?id=${idSelectedEnvio}`);

        if (buscar.data.length > 0) {
          for (const rowtest of rowsEnvio) {
            console.log(`ID: ${rowtest.id}, modo_envio: ${rowtest.modo_envio}`);
            if (rowtest.modo_envio.trim() === "") {
              setBtnAddEnvio(true);
              break;
            } else {
              setBtnAddEnvio(false);
            }
          }

          setBtnDeleteEnvio(false);
          setBtnSaveEnvio(false);
        } else {
          setBtnAddEnvio(true);
          setBtnDeleteEnvio(true);
          setBtnSaveEnvio(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (idSelectedEnvio !== null) {
      updateButtons();
    }
  }, [idSelectedEnvio]); // Escucha cambios en `idSelected`

  const handleRowUpdateEnvio = (updatedRowEnvio) => {
    setEnvio({
      modo_envio: updatedRowEnvio.modo_envio,
    });

    setRowsEnvio((prevEnvio) =>
      prevEnvio.map((rowEnvio) =>
        rowEnvio.id === updatedRowEnvio.id ? updatedRowEnvio : rowEnvio
      )
    );
    return updatedRowEnvio;
  };
  //******************************************************* */
  //incoterm
  const [rowsIncoterm, setRowsIncoterm] = React.useState([]);
  const columnsIncoterm = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "incoterm",
      headerName: "Incoterm",
      width: 500,
      editable: true,
    },
  ];
  //Estados de los botones
  const [btnAddIncoterm, setBtnAddIncoterm] = useState(false);
  const [btnDeleteIncoterm, setBtnDeleteIncoterm] = useState(true);
  const [btnSaveIncoterm, setBtnSaveIncoterm] = useState(true);
  //Eliminar o actualizar
  const [idSelectedIncoterm, setIdSelectedIncoterm] = useState(null);

  const handleAddRowIncoterm = async () => {
    setBtnAddIncoterm(true);
    setBtnDeleteIncoterm(true);
    setBtnSaveIncoterm(false);
    let inicio = 1;
    try {
      const res = await axios.get("/api/incoterm/");

      if (res.data.length > 0) {
        const lastId = res.data[res.data.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }

      const newRowIncoterm = { id: inicio, incoterm: "" };
      setRowsIncoterm((prevIncoterm) => [newRowIncoterm, ...prevIncoterm]);
      setIncoterm({ id: "", incoterm: "" });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const [incoterm, setIncoterm] = useState({
    id: "",
    incoterm: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/incoterm/");
        setRowsIncoterm(res.data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarIncoterm = async () => {
    try {
      console.log("el inco es: ", incoterm);

      if (incoterm?.incoterm === "" || incoterm?.incoterm === null) {
        Advertencia();
      } else {
        const buscar = await axios.get(
          `/api/incoterm/?id=${idSelectedIncoterm}`
        );
        if (buscar.data.length > 0) {
          await axios.put(`/api/incoterm/${idSelectedIncoterm}`, incoterm);
          update("Incoterm ");
        } else {
          await axios.post("/api/incoterm/", incoterm);
          const res2 = await axios.get("/api/incoterm/");
          setRowsIncoterm(res2.data);
          setBtnAddIncoterm(false);
          setBtnDeleteIncoterm(true);
          setBtnSaveIncoterm(true);
          Success("Incoterm ");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteIncoterm = async () => {
    console.log("el id es: " + idSelectedIncoterm);
    if (idSelectedIncoterm !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelectedIncoterm}?`)) {
          const res = await axios.delete(`/api/incoterm/${idSelectedIncoterm}`);
          Delete(incoterm.incoterm + " ");
          const res2 = await axios.get("/api/incoterm/");
          setRowsIncoterm(res2.data);
        }
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    }
  };
  const handleClickRowIncoterm = async (params) => {
    console.log("los params envio es: " + params.row.incoterm);

    setIncoterm({
      incoterm: params.row.incoterm,
    });
    setIdSelectedIncoterm(params.id);
  };

  useEffect(() => {
    const updateButtonsIncoterm = async () => {
      try {
        const buscar = await axios.get(
          `/api/incoterm/?id=${idSelectedIncoterm}`
        );
        if (buscar.data.length > 0) {
          for (const rowtest of rowsIncoterm) {
            console.log(`ID: ${rowtest.id}, incoterm: ${rowtest.incoterm}`);
            if (rowtest.incoterm.trim() === "") {
              setBtnAddIncoterm(true);
              break;
            } else {
              setBtnAddIncoterm(false);
            }
          }

          setBtnDeleteIncoterm(false);
          setBtnSaveIncoterm(false);
        } else {
          setBtnAddIncoterm(true);
          setBtnDeleteIncoterm(true);
          setBtnSaveIncoterm(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (idSelectedIncoterm !== null) {
      updateButtonsIncoterm();
    }
  }, [idSelectedIncoterm]); // Escucha cambios en `idSelected`

  const handleRowUpdateIncoterm = (updatedRowIncoterm) => {
    setIncoterm({
      incoterm: updatedRowIncoterm.incoterm,
    });
    console.log(incoterm);
    setRowsIncoterm((prevIncoterm) =>
      prevIncoterm.map((rowIncoterm) =>
        rowIncoterm.id === updatedRowIncoterm.id
          ? updatedRowIncoterm
          : rowIncoterm
      )
    );
    return updatedRowIncoterm;
  };
  //******************************************************* */
  //razon
  const [rowsRazon, setRowsRazon] = React.useState([]);
  const columnsRazon = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "razon",
      headerName: "Razon",
      width: 500,
      editable: true,
    },
  ];
  //Estados de los botones
  const [btnAddRazon, setBtnAddRazon] = useState(false);
  const [btnDeleteRazon, setBtnDeleteRazon] = useState(true);
  const [btnSaveRazon, setBtnSaveRazon] = useState(true);
  //Eliminar o actualizar
  const [idSelectedRazon, setIdSelectedRazon] = useState(null);

  const handleAddRowRazon = async () => {
    setBtnAddRazon(true);
    setBtnDeleteRazon(true);
    setBtnSaveRazon(false);
    let inicio = 1;
    try {
      const res = await axios.get("/api/razon/");

      if (res.data.length > 0) {
        const lastId = res.data[res.data.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }

      const newRowRazon = { id: inicio, razon: "" };
      setRowsRazon((prevRazon) => [newRowRazon, ...prevRazon]);
      setRazon({ id: "", razon: "" });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const [Razon, setRazon] = useState({
    id: "",
    razon: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/razon/");
        setRowsRazon(res.data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarRazon = async () => {
    try {
      if (Razon.razon.trim() === "") {
        Advertencia();
      } else {
        const buscar = await axios.get(`/api/razon/?id=${idSelectedRazon}`);
        if (buscar.data.length > 0) {
          await axios.put(`/api/razon/${idSelectedRazon}`, Razon);
          update("Razon ");
        } else {
          await axios.post("/api/razon/", Razon);
          const res2 = await axios.get("/api/razon/");
          setRowsRazon(res2.data);
          setBtnAddRazon(false);
          setBtnDeleteRazon(true);
          setBtnSaveRazon(true);
          Success("Razon ");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteRazon = async () => {
    console.log("el id es: " + idSelectedRazon);
    if (idSelectedRazon !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelectedRazon}?`)) {
          const res = await axios.delete(`/api/razon/${idSelectedRazon}`);
          Delete(Razon.razon + " ");
          const res2 = await axios.get("/api/razon/");
          setRowsRazon(res2.data);
        }
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    }
  };
  const handleClickRowRazon = async (params) => {
    setRazon({
      razon: params.row.razon,
    });
    setIdSelectedRazon(params.id);
  };

  useEffect(() => {
    const updateButtonsRazon = async () => {
      try {
        const buscar = await axios.get(`/api/razon/?id=${idSelectedRazon}`);
        if (buscar.data.length > 0) {
          for (const rowtest of rowsRazon) {
            console.log(`ID: ${rowtest.id}, razon: ${rowtest.razon}`);
            if (rowtest.razon.trim() === "") {
              setBtnAddRazon(true);
              break;
            } else {
              setBtnAddRazon(false);
            }
          }

          setBtnDeleteRazon(false);
          setBtnSaveRazon(false);
        } else {
          setBtnAddRazon(true);
          setBtnDeleteRazon(true);
          setBtnSaveRazon(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (idSelectedRazon !== null) {
      updateButtonsRazon();
    }
  }, [idSelectedRazon]); // Escucha cambios en `idSelected`

  const handleRowUpdateRazon = (updatedRowRazon) => {
    setRazon({
      razon: updatedRowRazon.razon,
    });
    console.log(Razon);
    setRowsRazon((prevRazon) =>
      prevRazon.map((rowRazon) =>
        rowRazon.id === updatedRowRazon.id ? updatedRowRazon : rowRazon
      )
    );
    return updatedRowRazon;
  };
  //******************************************************* */
  //unidad_medida
  const [rowsUnidad_medida, setRowsUnidad_medida] = React.useState([]);
  const columnsUnidad_medida = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "unidad_medida",
      headerName: "Unidad de medida",
      width: 500,
      editable: true,
    },
  ];
  //Estados de los botones
  const [btnAddUnidad_medida, setBtnAddUnidad_medida] = useState(false);
  const [btnDeleteUnidad_medida, setBtnDeleteUnidad_medida] = useState(true);
  const [btnSaveUnidad_medida, setBtnSaveUnidad_medida] = useState(true);
  //Eliminar o actualizar
  const [idSelectedunidad_medida, setIdSelectedunidad_medida] = useState(null);

  const handleAddRowUnidad_medida = async () => {
    setBtnAddUnidad_medida(true);
    setBtnDeleteUnidad_medida(true);
    setBtnSaveUnidad_medida(false);
    let inicio = 1;
    try {
      const res = await axios.get("/api/unidad_medida/");

      if (res.data.length > 0) {
        const lastId = res.data[res.data.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }

      const newRowunidad_medida = { id: inicio, unidad_medida: "" };
      setRowsUnidad_medida((prevunidad_medida) => [
        newRowunidad_medida,
        ...prevunidad_medida,
      ]);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.log("error: " + error);
    }
  };
  const [unidad_medida, setUnidad_medida] = useState({
    id: "",
    unidad_medida: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/unidad_medida/");
        setRowsUnidad_medida(res.data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarUnidad_medida = async () => {
    try {
      if (unidad_medida.unidad_medida.trim() === "") {
        Advertencia();
      } else {
        const buscar = await axios.get(
          `/api/unidad_medida/?id=${idSelectedunidad_medida}`
        );
        if (buscar.data.length > 0) {
          await axios.put(
            `/api/unidad_medida/${idSelectedunidad_medida}`,
            unidad_medida
          );
          update("Unidad de medida ");
        } else {
          await axios.post("/api/unidad_medida/", unidad_medida);
          Success("Unidad de medida ");
          const res2 = await axios.get("/api/unidad_medida/");
          setRowsUnidad_medida(res2.data);
          setBtnAddUnidad_medida(false);
          setBtnDeleteUnidad_medida(true);
          setBtnSaveUnidad_medida(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteUnidad_medida = async () => {
    console.log("el id es: " + idSelectedunidad_medida);
    if (idSelectedunidad_medida !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelectedunidad_medida}?`)) {
          const res = await axios.delete(
            `/api/unidad_medida/${idSelectedunidad_medida}`
          );
          Delete("Unidad de medida ");
          const res2 = await axios.get("/api/unidad_medida/");
          setRowsUnidad_medida(res2.data);
        }
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    }
  };
  const handleClickRowUnidad_medida = async (params) => {
    setIdSelectedunidad_medida(params.id);
  };

  useEffect(() => {
    const updateButtonsunidad_medida = async () => {
      try {
        const buscar = await axios.get(
          `/api/unidad_medida/?id=${idSelectedunidad_medida}`
        );
        if (buscar.data.length > 0) {
          setBtnAddUnidad_medida(false);
          setBtnDeleteUnidad_medida(false);
          setBtnSaveUnidad_medida(false);
        } else {
          setBtnAddUnidad_medida(true);
          setBtnDeleteUnidad_medida(true);
          setBtnSaveUnidad_medida(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (idSelectedunidad_medida !== null) {
      updateButtonsunidad_medida();
    }
  }, [idSelectedunidad_medida]); // Escucha cambios en `idSelected`

  const handleRowUpdateUnidad_medida = (updatedRowunidad_medida) => {
    setUnidad_medida({
      unidad_medida: updatedRowunidad_medida.unidad_medida,
    });
    console.log(unidad_medida);
    setRowsUnidad_medida((prevunidad_medida) =>
      prevunidad_medida.map((rowunidad_medida) =>
        rowunidad_medida.id === updatedRowunidad_medida.id
          ? updatedRowunidad_medida
          : rowunidad_medida
      )
    );
    return updatedRowunidad_medida;
  };
  //******************************************************* */
  //Locacion
  const [rowsLocacion, setRowsLocacion] = React.useState([]);
  const columnsLocacion = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "locacion",
      headerName: "Locacion",
      width: 250,
      editable: true,
    },
    {
      field: "direccion",
      headerName: "Direccion",
      width: 400,
      editable: true,
    },
    {
      field: "documento",
      headerName: "Tipo de documento",
      width: 400,
      editable: true,
    },
  ];
  //Estados de los botones
  const [btnAddLocacion, setBtnAddLocacion] = useState(false);
  const [btnDeleteLocacion, setBtnDeleteLocacion] = useState(true);
  const [btnSaveLocacion, setBtnSaveLocacion] = useState(true);
  //Eliminar o actualizar
  const [idSelectedLocacion, setIdSelectedLocacion] = useState(null);

  /* const handleAddRowLocacion = async () => {
    setBtnAddLocacion(true);
    setBtnDeleteLocacion(true);
    setBtnSaveLocacion(false);
    let inicio = 1;
    try {
      const res = await axios.get("/api/locacion/");

      if (res.data.length > 0) {
        const lastId = res.data[res.data.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }

      const newRowLocacion = { id: inicio, Locacion: "", Direccion: "" };
      setRowsLocacion((prevLocacion) => [newRowLocacion, ...prevLocacion]);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.log("error: " + error);
    }
  }; */
  const [locacion, setLocacion] = useState({
    id: "",
    locacion: "",
    direccion: "",
    documento: "",
  });
  const [titulo, setTitulo] = useState("Seleccionar");
  const handleAddRowLocacion = () => {
    setIdSelectedLocacion(null);
    setLocacion({
      id: "",
      locacion: "",
      direccion: "",
      documento: "",
    });
    setOpenModalLocacion(true);
  };
  const [openModalLocacion, setOpenModalLocacion] = useState(false); //Para abrir el modal de datos
  const handleCloseModalLocacion = () => {
    setOpenModalLocacion(false);
  };
  const handleChangeSetInfoLocacion = (e) => {
    const { name, value } = e.target;
    setLocacion((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("Cambio:", name, value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/locacion/");
        setRowsLocacion(res.data);
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarLocacion = async () => {
    console.log("la locacion es: ", locacion);

    try {
      if (
        locacion.locacion.trim() === "" ||
        locacion.direccion.trim() === "" ||
        locacion.documento === ""
      ) {
        Advertencia();
      } else {
        const buscar = await axios.get(
          `/api/locacion/?id=${idSelectedLocacion}`
        );
        if (buscar.data.length > 0) {
          await axios.put(`/api/locacion/${idSelectedLocacion}`, locacion);
          Success("Locacion ");
        } else {
          await axios.post("/api/locacion/", locacion);
          update("Locacion ");
          const res2 = await axios.get("/api/locacion/");
          setRowsLocacion(res2.data);
          setBtnAddLocacion(false);
          setBtnDeleteLocacion(true);
          setBtnSaveLocacion(true);
        }
        setOpenModalLocacion(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteLocacion = async () => {
    console.log("el id es: " + idSelectedLocacion);
    if (idSelectedLocacion !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelectedLocacion}?`)) {
          const res = await axios.delete(`/api/locacion/${idSelectedLocacion}`);
          Delete("Locacion ");
          const res2 = await axios.get("/api/locacion/");
          setRowsLocacion(res2.data);
        }
      } catch (err) {
        console.error("Error al obtener artículos:", err);
      }
    }
  };
  const handleClickRowLocacion = async (params) => {
    setIdSelectedLocacion(params.id);
  };

  useEffect(() => {
    const updateButtonsLocacion = async () => {
      try {
        const buscar = await axios.get(
          `/api/locacion/?id=${idSelectedLocacion}`
        );
        if (buscar.data.length > 0) {
          setBtnAddLocacion(false);
          setBtnDeleteLocacion(false);
          setBtnSaveLocacion(false);
        } else {
          setBtnAddLocacion(true);
          setBtnDeleteLocacion(true);
          setBtnSaveLocacion(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (idSelectedLocacion !== null) {
      updateButtonsLocacion();
    }
  }, [idSelectedLocacion]); // Escucha cambios en `idSelected`

  const handleRowUpdateLocacion = (updatedRowLocacion) => {
    setLocacion({
      locacion: updatedRowLocacion.locacion,
      direccion: updatedRowLocacion.direccion,
    });
    setRowsLocacion((prevLocacion) =>
      prevLocacion.map((rowLocacion) =>
        rowLocacion.id === updatedRowLocacion.id
          ? updatedRowLocacion
          : rowLocacion
      )
    );
    return updatedRowLocacion;
  };
  //******************************************************* */

  //tipo_material
  //------------------------------------CONSULTA BASE DE DATOS------------------------------------------------------/
  const [respons, setRespons] = useState([]);

  useEffect(() => {
    axios
      .get("/api/empleados")
      .then((response) => {
        setRespons(response.data);
        console.log("el respons es: ", response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los Respons:", error);
      });
  }, []);

  //---------------------------------------------------------------------------------------------------/
  const [openModal, setOpenModal] = useState(false); //Para abrir el modal de datos
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleChangeSetInfo = (e) => {
    console.log("el key es", e.target.key);

    setMaterial({ ...material, [e.target.name]: e.target.value });
    console.log(e.target.value, e.target.name);
  };
  //******************editar datos******************** */
  const [openModalEditar, setOpenModalEditar] = useState(false); //Para abrir el modal de datos
  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
  };
  const handleEditarMaterial = () => {
    setOpenModalEditar(true);
  };
  const [rowsTipo_material, setRowsTipo_material] = React.useState([]);
  const columnsTipo_material = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "tipo_material",
      headerName: "Tipo de material",
      width: 150,
      editable: false,
    },
    {
      field: "responsable1",
      headerName: "Responsable 1",
      width: 300,
      editable: false,
    },
    {
      field: "suplente",
      headerName: "Suplente",
      width: 300,
      editable: false,
    },
    {
      field: "responsable2",
      headerName: "Responsable 2",
      width: 300,
      editable: false,
    },
  ];
  //Estados de los botones
  const [btnAddTipo_material, setBtnAddTipo_material] = useState(false);
  const [btnDeleteTipo_material, setBtnDeleteTipo_material] = useState(true);
  const [btnSaveTipo_material, setBtnSaveTipo_material] = useState(true);
  //Eliminar o actualizar
  const [idSelectedTipo_material, setIdSelectedTipo_material] = useState(null);
  const [material, setMaterial] = useState({
    id: "",
    tipo_material: "",
    responsable1: "",
    suplente: "",
    responsable2: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/tipo_material/");
        setRowsTipo_material(res.data);
      } catch (err) {
        console.error("Error al obtener Tipo_material:", err);
      }
    };

    fetchData();
  }, []);

  const handleClickGuardarTipo_material = async () => {
    try {
      const buscar = await axios.get(
        `/api/tipo_material/?id=${idSelectedTipo_material}`
      );
      if (buscar.data.length > 0) {
        await axios.put(
          `/api/tipo_material/${idSelectedTipo_material}`,
          material
        );
        update("Tipo de material ");
        setOpenModalEditar(false);
      } else {
        await axios.post("/api/tipo_material/", material);
        Success("Tipo de material ");
        /*  setBtnAddTipo_material(false);
        setBtnDeleteTipo_material(true);
        setBtnSaveTipo_material(true); */

        setOpenModal(false);
      }
      const res2 = await axios.get("/api/tipo_material/");
      setIdSelectedTipo_material(0);
      setRowsTipo_material(res2.data);
      setMaterial({
        id: "",
        tipo_material: "",
        responsable1: "",
        suplente: "",
        responsable2: "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAddRowTipo_material = () => {
    setIdSelectedTipo_material(null);
    setMaterial({
      id: "",
      tipo_material: "",
      responsable1: "",
      suplente: "",
      responsable2: "",
    });
    setOpenModal(true);
  };
  const handleDeleteTipo_material = async () => {
    console.log("el id es: " + idSelectedTipo_material);
    if (idSelectedTipo_material !== 0) {
      try {
        if (confirm(`Eliminar id ${idSelectedTipo_material}?`)) {
          const res = await axios.delete(
            `/api/tipo_material/${idSelectedTipo_material}`
          );
          Delete("Tipo de material ");
          const res2 = await axios.get("/api/tipo_material/");
          setRowsTipo_material(res2.data);
        }
      } catch (err) {
        console.error("Error al obtener Tipo_material:", err);
      }
    }
  };
  const handleClickRowTipo_material = async (params) => {
    setBtnDeleteTipo_material(false);
    setBtnSaveTipo_material(false);
    setIdSelectedTipo_material(params.id);

    const getEmpIdByName = (name) => {
      const match = respons.find((r) => r.emp_nombre === name);
      return match ? match.emp_id : "";
    };

    const nuevoMaterial = {
      tipo_material: params.row.tipo_material,
      responsable1: getEmpIdByName(params.row.responsable1),
      suplente: getEmpIdByName(params.row.suplente),
      responsable2: getEmpIdByName(params.row.responsable2),
    };

    setMaterial(nuevoMaterial);
    console.log("Material cargado para edición (IDs):", nuevoMaterial);
  };

  //****************************************************************** */
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // width: "100%",
          marginLeft: "7cm",
          marginRight: "7cm",
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
              <Tab label="Transportista" {...a11yProps(0)} sx={StylePestañas} />
              <Tab label="Modo de envio" {...a11yProps(1)} sx={StylePestañas} />
              <Tab label="Incoterm" {...a11yProps(2)} sx={StylePestañas} />
              <Tab label="Tipo Material" {...a11yProps(3)} sx={StylePestañas} />
              <Tab label="Razon" {...a11yProps(4)} sx={StylePestañas} />
              <Tab label="Unidad Medida" {...a11yProps(5)} sx={StylePestañas} />
              <Tab label="Locacion" {...a11yProps(6)} sx={StylePestañas} />
              <Tab label="Cost Center" {...a11yProps(7)} sx={StylePestañas} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRow}
                  disabled={btnAdd}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteTransportista(transportista)}
                  disabled={btnDelete}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGuardarTransportista()}
                  disabled={btnSave}
                >
                  <SaveIcon />
                </Button>
              </div>
              <Box sx={{ height: 400, width: "100%" }}>
                {mounted ? (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={(params) => handleClickRowTransportista(params)}
                    disableSelectionOnClick
                    processRowUpdate={handleRowUpdate}
                  />
                ) : (
                  <Typography>Cargando informacion...</Typography>
                )}
              </Box>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRowEnvio}
                  disabled={btnAddEnvio}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteEnvio(params)}
                  disabled={btnDeleteEnvio}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGuardarEnvio()}
                  disabled={btnSaveEnvio}
                >
                  <SaveIcon />
                </Button>
              </div>
              <DataGrid
                rows={rowsEnvio}
                columns={columnsEnvio}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(params) => handleClickRowEnvio(params)}
                disableSelectionOnClick
                processRowUpdate={handleRowUpdateEnvio}
              />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRowIncoterm}
                  disabled={btnAddIncoterm}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteIncoterm(params)}
                  disabled={btnDeleteIncoterm}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGuardarIncoterm()}
                  disabled={btnSaveIncoterm}
                >
                  <SaveIcon />
                </Button>
              </div>
              <DataGrid
                rows={rowsIncoterm}
                columns={columnsIncoterm}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(params) => handleClickRowIncoterm(params)}
                disableSelectionOnClick
                processRowUpdate={handleRowUpdateIncoterm}
              />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRowTipo_material}
                  disabled={btnAddTipo_material}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteTipo_material(params)}
                  disabled={btnDeleteTipo_material}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleEditarMaterial}
                  disabled={btnSaveTipo_material}
                >
                  <EditIcon />
                </Button>
              </div>
              <DataGrid
                rows={rowsTipo_material}
                columns={columnsTipo_material}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(params) => handleClickRowTipo_material(params)}
                disableSelectionOnClick
                /* processRowUpdate={handleRowUpdateTipo_material} */
              />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRowRazon}
                  disabled={btnAddRazon}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteRazon(params)}
                  disabled={btnDeleteRazon}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGuardarRazon()}
                  disabled={btnSaveRazon}
                >
                  <SaveIcon />
                </Button>
              </div>
              <DataGrid
                rows={rowsRazon}
                columns={columnsRazon}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(params) => handleClickRowRazon(params)}
                disableSelectionOnClick
                processRowUpdate={handleRowUpdateRazon}
              />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRowUnidad_medida}
                  disabled={btnAddUnidad_medida}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteUnidad_medida(params)}
                  disabled={btnDeleteUnidad_medida}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGuardarUnidad_medida()}
                  disabled={btnSaveUnidad_medida}
                >
                  <SaveIcon />
                </Button>
              </div>
              <DataGrid
                rows={rowsUnidad_medida}
                columns={columnsUnidad_medida}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(params) => handleClickRowUnidad_medida(params)}
                disableSelectionOnClick
                processRowUpdate={handleRowUpdateUnidad_medida}
              />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRowLocacion}
                  disabled={btnAddLocacion}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteLocacion(params)}
                  disabled={btnDeleteLocacion}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGuardarLocacion()}
                  disabled={btnSaveLocacion}
                >
                  <SaveIcon />
                </Button>
              </div>
              <DataGrid
                rows={rowsLocacion}
                columns={columnsLocacion}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(params) => handleClickRowLocacion(params)}
                disableSelectionOnClick
                processRowUpdate={handleRowUpdateLocacion}
              />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ marginBottom: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleAddRowCostCenter}
                  disabled={btnAddCostCenter}
                >
                  <AddOutlinedIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={(params) => handleDeleteCostCenter(costCenter)}
                  disabled={btnDeleteCostCenter}
                >
                  <DeleteIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGuardarCostCenter()}
                  disabled={btnSaveCostCenter}
                >
                  <SaveIcon />
                </Button>
              </div>
              <DataGrid
                rows={rowsCostCenter}
                columns={columnsCostCenter}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={(params) => handleClickRowCostCenter(params)}
                disableSelectionOnClick
                processRowUpdate={handleRowUpdateCostCenter}
              />
            </div>
          </CustomTabPanel>
        </Box>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          sx={{
            "& > :not(style)": {
              m: 1,
              width: "120ch",
            },
          }}
          noValidate
          autoComplete="off"
          style={{
            width: "350px",
            fontSize: "20px",
          }}
        >
          <Box sx={{ ...style, p: 4, borderRadius: 2 }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Tipo de Material
            </Typography>

            <Stack spacing={3} alignItems="center" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                name="tipo_material"
                id="tipo-material"
                label="Tipo de Material"
                variant="outlined"
                size="small"
                onChange={handleChangeSetInfo}
                sx={{ maxWidth: 400 }}
              />

              <FormControl fullWidth variant="outlined" sx={{ maxWidth: 400 }}>
                <InputLabel id="responsable1-label">Responsable 1</InputLabel>
                <Select
                  labelId="responsable1-label"
                  id="responsable1-select"
                  name="responsable1"
                  value={material.responsable1}
                  label="Responsable 1"
                  onChange={handleChangeSetInfo}
                >
                  {respons.map((r) => (
                    <MenuItem key={r.emp_id} value={r.emp_id}>
                      {r.emp_nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ maxWidth: 400 }}>
                <InputLabel id="suplente-label">Suplente</InputLabel>
                <Select
                  labelId="suplente-label"
                  id="suplente-select"
                  name="suplente"
                  value={material.suplente}
                  label="Suplente"
                  onChange={handleChangeSetInfo}
                >
                  {respons.map((r) => (
                    <MenuItem key={r.emp_id} value={r.emp_id}>
                      {r.emp_nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ maxWidth: 400 }}>
                <InputLabel id="responsable2-label">Responsable 2</InputLabel>
                <Select
                  labelId="responsable2-label"
                  id="responsable2-select"
                  name="responsable2"
                  value={material.responsable2}
                  label="Responsable 2"
                  onChange={handleChangeSetInfo}
                >
                  {respons.map((r) => (
                    <MenuItem key={r.emp_id} value={r.emp_id}>
                      {r.emp_nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="large"
                onClick={handleClickGuardarTipo_material}
                sx={{ maxWidth: 400 }}
              >
                Confirmar
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openModalEditar}
        onClose={handleCloseModalEditar}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          sx={{
            "& > :not(style)": {
              m: 1,
              width: "120ch",
            },
          }}
          noValidate
          autoComplete="off"
          style={{
            width: "350px",
            fontSize: "20px",
          }}
        >
          <Box sx={style}>
            <h1
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              Tipo de Material
            </h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "400px",
                padding: "1rem",
                gap: "1rem",
              }}
            >
              <TextField
                name="tipo_material"
                id="outlined-basic1"
                type="text"
                variant="outlined"
                size="small"
                value={material.tipo_material}
                onChange={handleChangeSetInfo}
                sx={{ width: "100%", maxWidth: "400px" }}
              />
              <label style={{ fontSize: "20px", marginTop: "0.5rem" }}>
                Responsable 1
              </label>
              <Select
                name="responsable1"
                labelId="respons-label"
                id="respons-select"
                value={material.responsable1}
                onChange={handleChangeSetInfo}
                variant="standard"
                sx={{ width: "100%", maxWidth: "400px" }}
              >
                {respons.map((respons) => (
                  <MenuItem key={respons.emp_id} value={respons.emp_id}>
                    {respons.emp_nombre}
                  </MenuItem>
                ))}
              </Select>
              <label style={{ fontSize: "20px", marginTop: "0.5rem" }}>
                Suplente
              </label>
              <Select
                name="suplente"
                labelId="respons-label"
                id="respons-select"
                value={material.suplente}
                onChange={handleChangeSetInfo}
                variant="standard"
                sx={{ width: "100%", maxWidth: "400px" }}
              >
                {respons.map((respons) => (
                  <MenuItem key={respons.id} value={respons.emp_id}>
                    {respons.emp_nombre}
                  </MenuItem>
                ))}
              </Select>
              <label style={{ fontSize: "20px", marginTop: "0.5rem" }}>
                Responsable 2
              </label>
              <Select
                name="responsable2"
                labelId="respons2-label"
                id="respons2-select"
                value={material.responsable2}
                onChange={handleChangeSetInfo}
                variant="standard"
                sx={{ width: "100%", maxWidth: "400px" }}
              >
                {respons.map((respons) => (
                  <MenuItem key={respons.id} value={respons.emp_id}>
                    {respons.emp_nombre}
                  </MenuItem>
                ))}
              </Select>
              <Button
                size="large"
                variant="contained"
                disableElevation
                onClick={() => handleClickGuardarTipo_material()}
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Actualizar
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openModalLocacion}
        onClose={handleCloseModalLocacion}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          sx={{
            "& > :not(style)": {
              m: 1,
              width: "120ch",
            },
          }}
          noValidate
          autoComplete="off"
          style={{
            width: "350px",
            fontSize: "20px",
          }}
        >
          <Box sx={{ ...style, p: 4, borderRadius: 2 }}>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Locación
            </Typography>

            <Stack spacing={3} alignItems="center" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                maxRows={1}
                name="locacion"
                id="locacion"
                label="Locación"
                variant="outlined"
                size="small"
                onChange={handleChangeSetInfoLocacion}
                sx={{ maxWidth: 400 }}
              />

              <TextField
                fullWidth
                name="direccion"
                id="direccion"
                label="Dirección"
                variant="outlined"
                size="small"
                onChange={handleChangeSetInfoLocacion}
                sx={{ maxWidth: 400 }}
              />

              <FormControl fullWidth variant="outlined" sx={{ maxWidth: 400 }}>
                <InputLabel id="documento-label">Título documento</InputLabel>
                <Select
                  labelId="documento-label"
                  id="documento-select"
                  name="documento"
                  value={locacion.documento}
                  label="Título documento" // 👈 clave para evitar traslape
                  onChange={handleChangeSetInfoLocacion}
                >
                  <MenuItem value="FORMATO SALIDA DE MATERIAL">
                    FORMATO SALIDA DE MATERIAL
                  </MenuItem>
                  <MenuItem value="COMMERCIAL INVOICE/PRO FORMA">
                    COMMERCIAL INVOICE/PRO FORMA
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="large"
                onClick={handleClickGuardarLocacion}
                sx={{ maxWidth: 400 }}
              >
                Confirmar
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
      <Mensaje
        mensaje={mensaje}
        estado={estado}
        open={openError}
        onClose={() => setOpenError(false)}
      />
    </>
  );
}
const StylePestañas = {
  fontSize: "11px",
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
export default Configuracion;
