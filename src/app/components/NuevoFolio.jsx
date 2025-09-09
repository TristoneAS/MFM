"use client";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useRouter } from "next/navigation";

import { Paper, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Mensaje from "./Mensaje";

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

function NuevoFolio() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fechaVisible, setFechaVisible] = useState(true);
  const [openError, setOpenError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("error"); // success, error, warning, info
  const [habilitar, setHabilitar] = useState({
    paso2: true,
    paso3: true,
    paso4: true,
    paso5: true,
    paso6: true,
    boton: true,
  });

  const Advertencia = () => {
    setMensaje("Debes llenar todos los datos");
    setEstado("warning");
    setOpenError(true);
  };
  const Success = (title) => {
    setMensaje("Guardado, Numero de Folio: " + title);
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
  //Materiales
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const handleDelete = () => {
    if (selectedRowId !== null) {
      setRows((prevRows) => {
        return prevRows.filter((row) => row.id !== selectedRowId);
      });

      setSelectedRowId(null);
    }
  };

  //Locacion Origen

  const [locacionesOrigen, setLocacionesOrigen] = useState([]);
  const [direccionOrigen, setDireccionOrigen] = useState("");

  const [tituloDocumento, setTituloDocumento] = useState("");
  const [locacionSelectedOrigen, setLocacionSelectedOrigen] = useState("");

  useEffect(() => {
    axios
      .get("/api/locacion")
      .then((response) => {
        setLocacionesOrigen(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las locaciones:", error);
      });
  }, []);

  const handleChangeLocacionOrigen = (event) => {
    const selectedValueOrigen = event.target.value;
    setLocacionSelectedOrigen(selectedValueOrigen);

    const locacionEncontradaOrigen = locacionesOrigen.find(
      (loc) => loc.id === selectedValueOrigen
    );

    if (locacionEncontradaOrigen) {
      setDireccionOrigen(locacionEncontradaOrigen.direccion);
    } else {
      setDireccionOrigen("");
    }
    setFolio((prev) => ({
      ...prev,
      origen_location: locacionEncontradaOrigen.locacion,
      origen_direccion: locacionEncontradaOrigen.direccion,
    }));
  }; //Locacion destino

  const [locaciones, setLocaciones] = useState([]);
  const [direccion, setDireccion] = useState("");
  const [locacionSelected, setLocacionSelected] = useState("");

  useEffect(() => {
    axios
      .get("/api/locacion")
      .then((response) => {
        setLocaciones(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las locaciones:", error);
      });
  }, []);

  const handleChangeLocacion = (event) => {
    const selectedValue = event.target.value;
    setLocacionSelected(selectedValue);

    const locacionEncontrada = locaciones.find(
      (loc) => loc.id === selectedValue
    );

    if (locacionEncontrada) {
      setDireccion(locacionEncontrada.direccion);
      setTituloDocumento(locacionEncontrada.documento);
    } else {
      setDireccion("");
      setTituloDocumento("");
    }
    setFolio((prev) => ({
      ...prev,
      destino_location: locacionEncontrada.locacion,
      destino_direccion: locacionEncontrada.direccion,
      documento: locacionEncontrada.documento,
    }));
  };

  //unidad_medida
  const [unidad_medida, setUnidad_medida] = useState([]);
  const [unidad_medidaSelected, setSelectedUnidad_medida] = useState("");
  useEffect(() => {
    axios
      .get("/api/unidad_medida")
      .then((response) => {
        setUnidad_medida(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los unidad_medida:", error);
      });
  }, []);
  const handleChangeUnidad_medida = (event) => {
    setSelectedUnidad_medida(event.target.value);
  };
  //razon
  const [razon, setRazon] = useState([]);
  const [razonSelected, setSelectedRazon] = useState("");
  useEffect(() => {
    axios
      .get("/api/razon")
      .then((response) => {
        setRazon(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los razon:", error);
      });
  }, []);
  const handleChangeRazon = (event) => {
    const value = event.target.value;

    setSelectedRazon(value);
    setFolio((prev) => ({
      ...prev,
      razon: value,
    }));
  };
  //incoterm
  const [incoterm, setincoterm] = useState([]);
  const [incotermSelected, setSelectedincoterm] = useState("");
  useEffect(() => {
    axios
      .get("/api/incoterm")
      .then((response) => {
        setincoterm(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los incoterm:", error);
      });
  }, []);
  const handleChangeincoterm = (event) => {
    const value = event.target.value;

    setSelectedincoterm(value);
    setFolio((prev) => ({
      ...prev,
      incoterm: value,
    }));
  }; //tipo_material
  const [tipo_material, settipo_material] = useState([]);
  const [tipo_materialSelected, setSelectedtipo_material] = useState("");
  const [responsable1, setResponsable1] = useState(null);
  const [suplente, setSuplente] = useState(null);
  const [responsable2, setResponsable2] = useState(null);
  useEffect(() => {
    axios
      .get("/api/tipo_material")
      .then((response) => {
        settipo_material(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los tipo_material:", error);
      });
  }, []);

  useEffect(() => {
    if (tipo_materialSelected !== "") {
      axios
        .get(`/api/tipo_material/?tipo_material=${tipo_materialSelected}`)
        .then((response) => {
          const data = response.data[0];
          setResponsable1(data.responsable1);
          setSuplente(data.suplente);
          setResponsable2(data.responsable2);

          setFolio((prev) => ({
            ...prev,
            tipo_material: tipo_materialSelected,
            responsable1: data.responsable1,
            suplente: data.suplente,
            responsable2: data.responsable2,
          }));
        })
        .catch((error) => {
          console.error("Error al cargar los tipo_material:", error);
        });
    } else {
      setResponsable1("");
      setSuplente("");
      setResponsable2("");

      setFolio((prev) => ({
        ...prev,
        tipo_material: "",
        responsable1: "",
        suplente: "",
        responsable2: "",
      }));
    }
  }, [tipo_materialSelected]);

  const handleChangetipo_material = (event) => {
    const newTipoMaterial = event.target.value;
    setSelectedtipo_material(newTipoMaterial);
  };

  //Transportista
  const [transportistas, setTransportistas] = useState([]);
  const [selectedTransportista, setSelectedTransportista] = useState("");
  useEffect(() => {
    axios
      .get("/api/transportista")
      .then((response) => {
        setTransportistas(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los transportistas:", error);
      });
  }, []);
  const handleChangeTransportista = (event) => {
    const value = event.target.value;
    setSelectedTransportista(value);

    setFolio((prev) => ({
      ...prev,
      transportista: value,
    }));
  };

  //Envio

  const [envio, setEnvio] = useState([]);
  const [selectedEnvio, setSelectedEnvio] = useState("");
  useEffect(() => {
    axios
      .get("/api/envio")
      .then((response) => {
        setEnvio(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los Envios:", error);
      });
  }, []);
  const handleChangeEnvio = (event) => {
    const value = event.target.value;

    setSelectedEnvio(value);
    setFolio((prev) => ({
      ...prev,
      modo_envio: value,
    }));
  };
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress > 35) {
      setHabilitar((prev) => ({
        ...prev,
        paso2: false,
      }));
    }
    if (progress > 70) {
      setHabilitar((prev) => ({
        ...prev,
        paso3: false,
      }));
    }
    if (progress > 89) {
      setHabilitar((prev) => ({
        ...prev,
        paso4: false,
        paso5: false,
        paso6: false,
      }));
    }
    if (progress === 100) {
      setHabilitar((prev) => ({
        ...prev,
        boton: false,
      }));
    } else {
      setHabilitar((prev) => ({
        ...prev,
        boton: true,
      }));
    }
  }, [progress]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [valor, setValor] = useState(""); //Para temporal o definitivo
  const [valor2, setValor2] = useState(""); //Para Categoria
  const [openModal, setOpenModal] = useState(false); //Para abrir el modal de agregar material
  const [totales, setTotales] = useState({
    cantidad: 0,
    valor: 0,
    pallets_cajas: 0,
    peso: 0,
  });
  //Progreso

  //fin Progreso
  const handleChangeTemODef = (e) => {
    const selectedValue = e.target.value;
    setValor(selectedValue);
    setFolio((prev) => ({
      ...prev,
      permanente_temporal: selectedValue,
    }));
  };
  const handleChangeCaT = (e) => {
    const selectedValue = e.target.value;
    setValor2(selectedValue);
    setFolio((prev) => ({
      ...prev,
      categoria: selectedValue,
    }));
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const [material, setMaterial] = useState({
    id: "",
    parte: "",
    descripcion: "",
    cantidad: "",
    um: "",
    valor: "",
    unitValue: "",
  }); //informacion provisional para el registro de material

  const handleChangeSetInfo = (e) => {
    setMaterial({ ...material, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (material.cantidad !== "" && material.unitValue !== "") {
      setMaterial((prev) => ({
        ...prev,
        valor: Number(material.cantidad) * Number(material.unitValue),
      }));
    }
  }, [material.cantidad, material.unitValue]);

  //Aqui se setea la informacion de cada material
  const handleChangeNuevoMaterial = () => {
    if (
      material.parte === "" ||
      material.descripcion === "" ||
      material.cantidad === "" ||
      material.um === "" ||
      material.valor === "" ||
      material.unitValue === ""
    ) {
      Advertencia();
    } else {
      let inicio = 1;
      if (rows.length > 0) {
        const lastId = rows[rows.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }
      setRows((rows) => [...rows, material]);

      setMaterial({
        id: "",
        parte: "",
        descripcion: "",
        um: "",
        cantidad: "",
        valor: "",
        unitValue: "",
      });
      setSelectedUnidad_medida("");
      setSelectedRowId(null);
      setOpenModal(false);
    }
  };
  const handleClickAbrirModal = () => {
    let inicio = 1;
    if (rows.length > 0) {
      const lastId = rows[rows.length - 1].id;
      if (lastId !== null) {
        inicio = Number(lastId) + 1;
      }
    }

    setItemId(inicio);
    setMaterial({ ...material, id: inicio });
    setOpenModal(true);
  };

  //********************nueva tabla */
  const [itemid, setItemId] = useState();
  const columns = [
    { field: "id", headerName: "#Item", width: 60 },
    {
      field: "parte",
      headerName: "#Part",
      width: 150,
      editable: true,
    },
    {
      field: "descripcion",
      headerName: "Descripcion",
      width: 150,
      editable: true,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      type: "number",
      width: 80,
      editable: true,
    },
    {
      field: "um",
      headerName: "UM",
      type: "number",
      width: 80,
      editable: true,
    },
    {
      field: "unitValue",
      headerName: "Valor unitario(USD)",
      type: "number",
      width: 139,
      editable: true,
    },
    {
      field: "valor",
      headerName: "valor Total(USD)",
      type: "number",
      width: 139,
      editable: true,
    },
  ];

  const [rows, setRows] = useState([]);
  //*****************Paqueteria */
  const [itemidPaqueteria, setItemIdPaqueteria] = useState();

  const [openModalPaqueteria, setOpenModalPaqueteria] = useState(false); //Para abrir el modal de agregar cajas
  const [rowsPaqueteria, setRowsPaqueteria] = useState([]);

  const columnsPaqueteria = [
    { field: "id", headerName: "Id", width: 60 },
    {
      field: "pallets_cajas",
      headerName: "Pallets/Cajas",
      width: 150,
      editable: true,
    },
    {
      field: "peso",
      headerName: "Peso(Kgs por pallet/caja)",
      width: 200,
      editable: true,
    },
    {
      field: "total_peso",
      headerName: "Peso(Kgs total)",
      width: 200,
      editable: true,
    },
    {
      field: "dimensiones",
      headerName: "Dimensiones",
      type: "number",
      width: 150,
      editable: true,
    },
  ];
  const [infoPaqueteria, setInfoPaqueteria] = useState({
    id: "",
    peso: "",
    pallets_cajas: "",
    total_peso: "",
    ancho: "",
    alto: "",
    largo: "",
    dimensiones: "",
  }); //informacion provisional para el registro de paqueteria
  const handleClickAbrirModalPaqueteria = () => {
    let inicio = 1;
    if (rowsPaqueteria.length > 0) {
      const lastId = rowsPaqueteria[rowsPaqueteria.length - 1].id;
      if (lastId !== null) {
        inicio = Number(lastId) + 1;
      }
    }

    setItemIdPaqueteria(inicio);
    setInfoPaqueteria({ ...infoPaqueteria, id: inicio });
    setOpenModalPaqueteria(true);
  };
  const handleCloseModalPaqueteria = () => {
    setOpenModalPaqueteria(false);
  };
  const handleChangeSetInfoPaqueteria = (e) => {
    const { name, value } = e.target;

    setInfoPaqueteria((prev) => {
      const updated = { ...prev, [name]: value };

      // Si el cambio viene de ancho, alto o largo
      if (["ancho", "alto", "largo"].includes(name)) {
        updated.dimensiones = `${updated.ancho || ""} x ${
          updated.alto || ""
        } x ${updated.largo || ""}`;
      }

      return updated;
    });
  };

  useEffect(() => {
    if (infoPaqueteria.pallets_cajas !== "" && infoPaqueteria.peso !== "") {
      setInfoPaqueteria((prev) => ({
        ...prev,
        total_peso:
          Number(infoPaqueteria.pallets_cajas) * Number(infoPaqueteria.peso),
      }));
    }
  }, [infoPaqueteria.pallets_cajas, infoPaqueteria.peso]);
  const handleChangeNuevoPaqueteria = () => {
    if (
      infoPaqueteria.peso === "" ||
      infoPaqueteria.pallets_cajas === "" ||
      infoPaqueteria.total_peso === "" ||
      infoPaqueteria.ancho === "" ||
      infoPaqueteria.alto === "" ||
      infoPaqueteria.largo === "" ||
      infoPaqueteria.dimensiones === ""
    ) {
      Advertencia();
    } else {
      let inicio = 1;
      if (rowsPaqueteria.length > 0) {
        const lastId = rowsPaqueteria[rowsPaqueteria.length - 1].id;
        if (lastId !== null) {
          inicio = lastId + 1;
        }
      }
      setRowsPaqueteria((rowsPaqueteria) => [
        ...rowsPaqueteria,
        infoPaqueteria,
      ]);

      setInfoPaqueteria({
        id: "",
        pallets_cajas: "",
        peso: "",
        dimensiones: "",
      });

      setSelectedRowId(null);
      setOpenModalPaqueteria(false);
    }
  };

  const [selectedRowIdPaqueteria, setSelectedRowIdPaqueteria] =
    React.useState(null);
  const handleDeletePaqueteria = () => {
    if (selectedRowIdPaqueteria !== null) {
      setRowsPaqueteria((prevRows) => {
        return prevRows.filter((row) => row.id !== selectedRowIdPaqueteria);
      });

      setSelectedRowIdPaqueteria(null);
    }
  };
  useEffect(() => {
    let sumaPallets_cajas = 0;
    let sumaPeso = 0;

    for (let i = 0; i < rowsPaqueteria.length; i++) {
      sumaPallets_cajas =
        Number(sumaPallets_cajas) + Number(rowsPaqueteria[i].pallets_cajas);
      sumaPeso = Number(sumaPeso) + Number(rowsPaqueteria[i].total_peso);
    }
    setTotales({
      pallets_cajas: sumaPallets_cajas,
      peso: sumaPeso,
      cantidad: totales.cantidad,
      valor: totales.valor,
    });
  }, [rowsPaqueteria]);
  //Folios
  const handleClickGuardarFolio = async () => {
    try {
      const resultado = await axios.post("/api/folio/", folio);
      const nuevasRows = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const nuevaRow = {
          folio_id: resultado.data.id,
          ...row,
        };
        nuevasRows.push(nuevaRow);
      }

      await axios.post("/api/material/", nuevasRows);

      if (rowsPaqueteria.length > 0) {
        const nuevasRowsPaqueteria = [];
        for (let i = 0; i < rowsPaqueteria.length; i++) {
          const row = rowsPaqueteria[i];
          const nuevaRow = {
            folio_id: resultado.data.id,
            ...row,
          };
          nuevasRowsPaqueteria.push(nuevaRow);
        }
        await axios.post("/api/paqueteria/", nuevasRowsPaqueteria);
      }

      Success(resultado.data.id);
      setLoading(true);
      setTimeout(() => {
        router.push("/dashboard/aprobaciones");
      }, 4000);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [folio, setFolio] = useState({
    folio_id: "",
    fecha: "",
    origen_location: "",
    origen_direccion: "",
    origen_contacto: "",
    origen_correo: "",
    destino_location: "",
    destino_direccion: "",
    destino_contacto: "",
    destino_correo: "",
    documento: "",
    sello: "",
    transportista: "",
    modo_envio: "",
    caja: "",
    incoterm: "",
    tipo_material: "",
    razon: "",
    permanente_temporal: "",
    fecha_retorno: "",
    creado_por: "",
    cost_center: "",
    cost_center_name: "",
    categoria: "",
    capex_po: "",
    responsable1: "",
    status_1: "Pendiente",
    suplente: "",
    status_S: "Pendiente",
    responsable2: "",
    status_2: "Pendiente",
    total_cantidad: "",
    total_pallets_cajas: "",
    total_peso: "",
    total_valor: "",
  });
  useEffect(() => {
    let origen_location = folio.origen_location !== "" ? 6 : 0;
    let origen_contacto = folio.origen_contacto !== "" ? 6 : 0;
    let origen_correo = folio.origen_correo !== "" ? 6 : 0;
    let destino_location = folio.destino_location !== "" ? 6 : 0;
    let destino_contacto = folio.destino_contacto !== "" ? 6 : 0;
    let destino_correo = folio.destino_correo !== "" ? 6 : 0;
    let sello = folio.sello !== "" ? 5 : 0;
    let transportista = folio.transportista !== "" ? 5 : 0;
    let modo_envio = folio.modo_envio !== "" ? 5 : 0;
    let caja = folio.caja !== "" ? 5 : 0;
    let incoterm = folio.incoterm !== "" ? 5 : 0;
    let tipo_material = folio.tipo_material !== "" ? 5 : 0;
    let razon = folio.razon !== "" ? 5 : 0;
    let permanente_temporal = folio.permanente_temporal !== "" ? 5 : 0;
    let cost_center = folio.cost_center !== "" ? 5 : 0;
    let categoria = folio.categoria !== "" ? 5 : 0;
    let capex_po = folio.capex_po !== "" ? 4 : 0;
    let mat = rows.length > 0 ? 10 : 0;
    setProgress(
      Number(origen_location) +
        Number(origen_contacto) +
        Number(origen_correo) +
        Number(destino_location) +
        Number(destino_contacto) +
        Number(destino_correo) +
        Number(sello) +
        Number(transportista) +
        Number(modo_envio) +
        Number(caja) +
        Number(incoterm) +
        Number(tipo_material) +
        Number(razon) +
        Number(permanente_temporal) +
        Number(cost_center) +
        Number(categoria) +
        Number(capex_po) +
        Number(mat)
    );
  }, [
    folio.origen_location,
    folio.origen_contacto,
    folio.origen_correo,
    folio.destino_location,
    folio.destino_contacto,
    folio.destino_correo,
    folio.sello,
    folio.transportista,
    folio.modo_envio,
    folio.caja,
    folio.incoterm,
    folio.tipo_material,
    folio.razon,
    folio.permanente_temporal,
    folio.cost_center,
    folio.categoria,
    folio.capex_po,
    rows,
  ]);
  useEffect(() => {
    setFolio((prev) => ({
      ...prev,
      total_cantidad: totales.cantidad,
      total_pallets_cajas: totales.pallets_cajas,
      total_peso: totales.peso,
      total_valor: totales.valor,
    }));
  }, [totales]);
  const handleChangeSetFolio = (e) => {
    setFolio((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    let sumaCantidad = 0;
    let sumaValor = 0;

    for (let i = 0; i < rows.length; i++) {
      sumaCantidad = Number(sumaCantidad) + Number(rows[i].cantidad);
      sumaValor = Number(sumaValor) + Number(rows[i].valor);
    }
    setTotales({
      pallets_cajas: totales.pallets_cajas,
      peso: totales.peso,
      cantidad: sumaCantidad,
      valor: sumaValor,
    });
  }, [rows]);
  /* poner usefect para cuando cambie rows y rowspaqueteria se haga la suma
   */ //CostCenter
  const [costCenter, setCostCenter] = useState([]);
  const [costCenterSelected, setCostCenterSelected] = useState("");
  const [costCenterName, setcostCenterName] = useState("");

  useEffect(() => {
    axios
      .get("/api/costcenter")
      .then((response) => {
        setCostCenter(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los costCenter:", error);
      });
  }, []);

  useEffect(() => {
    if (costCenterSelected !== "") {
      axios
        .get(`/api/costcenter/?cost_center=${costCenterSelected}`)
        .then((response) => {
          const name = response.data[0]?.cost_center_name || "";
          setcostCenterName(name);

          const hoy = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

          setFolio((prev) => ({
            ...prev,
            cost_center: costCenterSelected,
            cost_center_name: name,
            fecha: hoy,
            creado_por: localStorage.getItem("emp_id"),
          }));
        })
        .catch((error) => {
          console.error("Error al cargar los costcenter:", error);
        });
    } else {
      setcostCenterName("");
      setFolio((prev) => ({
        ...prev,
        cost_center: "",
        cost_center_name: "",
      }));
    }
  }, [costCenterSelected]);

  const handleChangeCostCenter = (event) => {
    setCostCenterSelected(event.target.value);
  };
  /**********Visibilidad del campo fecha de retorno */
  useEffect(() => {
    if (folio.permanente_temporal === "Definitivo") {
      setFechaVisible(false);
    } else {
      setFechaVisible(true);
    }
  }, [folio.permanente_temporal]);
  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h5 style={{ textAlign: "center", marginBottom: "16px" }}>
            Ingresa todos los datos
          </h5>
          <FormControl fullWidth>
            <TextField
              name="id"
              label="Item #"
              variant="standard"
              onBlur={handleChangeSetInfo}
              value={itemid}
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "black", // Texto más oscuro
                  WebkitTextFillColor: "black", // Para Safari/Chrome
                  opacity: 1, // Quita transparencia
                },
                "& .MuiInput-underline.Mui-disabled:before": {
                  borderBottomStyle: "dashed", // Línea punteada
                },
                backgroundColor: "#f0f0f0", // Fondo gris claro
                borderRadius: "4px",
                padding: "4px",
              }}
            />
            <TextField
              name="parte"
              label="Part #"
              variant="standard"
              onBlur={handleChangeSetInfo}
              slotProps={{
                input: {
                  inputProps: { maxLength: 99 },
                },
              }}
              sx={textFieldStyles}
            />

            <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
              <InputLabel id="unidad_medida-label">Unidad de Medida</InputLabel>
              <Select
                name="um"
                labelId="unidad_medida-label"
                id="unidad_medida-select"
                value={unidad_medidaSelected}
                onChange={handleChangeUnidad_medida}
                onBlur={handleChangeSetInfo}
                displayEmpty
                sx={textFieldStyles}
              >
                {unidad_medida.map((unidad) => (
                  <MenuItem key={unidad.id} value={unidad.unidad_medida}>
                    {unidad.unidad_medida}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="cantidad"
              label="Cantidad"
              variant="standard"
              type="text"
              inputProps={{ maxLength: 10 }}
              onInput={(e) => {
                let v = e.target.value
                  .replace(",", ".")
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\./g, "$1");

                if (v.startsWith(".")) {
                  v = "0" + v;
                }

                if (v.length > 10) {
                  v = v.slice(0, 10);
                }

                e.target.value = v;
              }}
              onBlur={handleChangeSetInfo}
              sx={textFieldStyles}
            />

            <TextField
              name="unitValue"
              label="Valor Unitario (USD)"
              variant="standard"
              type="text"
              inputProps={{ maxLength: 10 }}
              onInput={(e) => {
                let v = e.target.value
                  .replace(",", ".")
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\./g, "$1");

                if (v.startsWith(".")) {
                  v = "0" + v;
                }

                if (v.length > 10) {
                  v = v.slice(0, 10);
                }

                e.target.value = v;
              }}
              onBlur={handleChangeSetInfo}
              sx={textFieldStyles}
            />
            <TextField
              name="descripcion"
              label="Descripcion"
              variant="standard"
              slotProps={{
                input: {
                  inputProps: { maxLength: 99 },
                },
              }}
              onBlur={handleChangeSetInfo}
              sx={textFieldStyles}
            />
          </FormControl>
          <Button
            size="large"
            variant="contained"
            disableElevation
            fullWidth
            onClick={handleChangeNuevoMaterial}
            sx={{ mt: 3 }}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openModalPaqueteria}
        onClose={handleCloseModalPaqueteria}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h5 style={{ textAlign: "center", marginBottom: "16px" }}>
            Ingresa todos los datos
          </h5>
          <FormControl fullWidth>
            <TextField
              name="id"
              label="id"
              value={itemidPaqueteria}
              variant="standard"
              onChange={handleChangeSetInfoPaqueteria}
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  color: "black", // Texto más oscuro
                  WebkitTextFillColor: "black", // Para Safari/Chrome
                  opacity: 1, // Quita transparencia
                },
                "& .MuiInput-underline.Mui-disabled:before": {
                  borderBottomStyle: "dashed", // Línea punteada
                },
                backgroundColor: "#f0f0f0", // Fondo gris claro
                borderRadius: "4px",
                padding: "4px",
              }}
            />
            <TextField
              name="peso"
              label="Peso (Kgs por pallet/caja)"
              variant="standard"
              type="text"
              inputProps={{ maxLength: 6 }}
              onInput={(e) => {
                let v = e.target.value
                  .replace(",", ".")
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\./g, "$1");

                if (v.startsWith(".")) {
                  v = "0" + v;
                }

                if (v.length > 6) {
                  v = v.slice(0, 6);
                }

                e.target.value = v;
              }}
              onChange={handleChangeSetInfoPaqueteria}
              sx={textFieldStyles}
            />
            <TextField
              name="pallets_cajas"
              label="Cantidad de Pallets_cajas."
              variant="standard"
              type="text"
              inputProps={{ maxLength: 6 }}
              onInput={(e) => {
                let v = e.target.value
                  .replace(",", ".")
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\./g, "$1");

                if (v.startsWith(".")) {
                  v = "0" + v;
                }

                if (v.length > 6) {
                  v = v.slice(0, 6);
                }

                e.target.value = v;
              }}
              onChange={handleChangeSetInfoPaqueteria}
              sx={textFieldStyles}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                name="ancho"
                label="Ancho (cm)"
                variant="standard"
                type="text"
                inputProps={{ maxLength: 5 }}
                onInput={(e) => {
                  let v = e.target.value
                    .replace(",", ".")
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\./g, "$1");

                  if (v.startsWith(".")) {
                    v = "0" + v;
                  }

                  if (v.length > 5) {
                    v = v.slice(0, 5);
                  }

                  e.target.value = v;
                }}
                onChange={handleChangeSetInfoPaqueteria}
                sx={textFieldStyles}
              />
              <TextField
                name="alto"
                label="Alto (cm)"
                variant="standard"
                type="text"
                inputProps={{ maxLength: 5 }}
                onInput={(e) => {
                  let v = e.target.value
                    .replace(",", ".")
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\./g, "$1");

                  if (v.startsWith(".")) {
                    v = "0" + v;
                  }

                  if (v.length > 5) {
                    v = v.slice(0, 5);
                  }

                  e.target.value = v;
                }}
                onChange={handleChangeSetInfoPaqueteria}
                sx={textFieldStyles}
              />
              <TextField
                name="largo"
                label="Largo (cm)"
                variant="standard"
                type="text"
                inputProps={{ maxLength: 5 }}
                onInput={(e) => {
                  let v = e.target.value
                    .replace(",", ".")
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\./g, "$1");

                  if (v.startsWith(".")) {
                    v = "0" + v;
                  }

                  if (v.length > 5) {
                    v = v.slice(0, 5);
                  }

                  e.target.value = v;
                }}
                onChange={handleChangeSetInfoPaqueteria}
                sx={textFieldStyles}
              />
            </Box>
            <TextField
              name="dimensiones"
              label="Dimensiones"
              value={infoPaqueteria.dimensiones}
              variant="standard"
              disabled
            />
          </FormControl>
          <Button
            size="large"
            variant="contained"
            disableElevation
            fullWidth
            onClick={handleChangeNuevoPaqueteria}
            sx={{ mt: 3 }}
          >
            Confirmar Informacion
          </Button>
        </Box>
      </Modal>
      <Box>
        <div
          style={{
            display: "flex",
            background: "rgb(250,250,250)",
            marginLeft: "6cm",
            marginRight: "4cm",
            //width: "100%",
            marginTop: "0.5cm",
            height: "1.4cm",
          }}
        >
          <Box
            position="relative"
            display="inline-flex"
            marginTop={"0.11cm"}
            marginLeft={"0.11cm"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <CircularProgress
              variant="determinate"
              value={progress}
              size={40}
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          </Box>
          <h1
            style={{
              display: "flex",
              marginLeft: "1cm",
              alignItems: "center",
              color: "rgb(149,149,149)",
              fontSize: "1.5rem",
            }}
          >
            FORMATO SALIDA DE MATERIAL
          </h1>
        </div>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // width: "100%",
            marginLeft: "6cm",
            marginRight: "4cm",
            background: "rgb(250,250,250)",
            height: "34rem",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Paso 1" {...a11yProps(0)} />
                <Tab
                  label="Paso 2"
                  {...a11yProps(1)}
                  disabled={habilitar.paso2}
                />

                <Tab
                  label="Paso 3"
                  {...a11yProps(2)}
                  disabled={habilitar.paso3}
                />

                <Tab
                  label="Paso 4 (Materiales)"
                  {...a11yProps(4)}
                  disabled={habilitar.paso4}
                />
                <Tab
                  label="Paso 5 (Paqueteria)"
                  {...a11yProps(5)}
                  disabled={habilitar.paso5}
                />
                <Tab
                  label="Paso 6"
                  {...a11yProps(6)}
                  disabled={habilitar.paso6}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {/* Origen -destino */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: "24px",
                  flexWrap: "wrap", // Para que en pantallas pequeñas se acomode
                }}
              >
                {/* CARD ORIGEN */}
                <Paper
                  elevation={6}
                  sx={{
                    flex: 1,
                    minWidth: 340,
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    gap: 3,
                    borderRadius: 4,
                    backgroundColor: "#fafafa",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}
                  >
                    Origen
                  </Typography>

                  <FormControl fullWidth>
                    <InputLabel>Origen Location</InputLabel>
                    <Select
                      value={locacionSelectedOrigen}
                      onChange={handleChangeLocacionOrigen}
                      label="Origen Location"
                    >
                      {locacionesOrigen.map((loc) => (
                        <MenuItem key={loc.id} value={loc.id}>
                          {loc.locacion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Dirección"
                    variant="outlined"
                    size="small"
                    value={direccionOrigen}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label="Contacto"
                    name="origen_contacto"
                    variant="outlined"
                    size="small"
                    value={folio.origen_contacto}
                    slotProps={{
                      input: {
                        inputProps: { maxLength: 99 },
                      },
                    }}
                    onChange={handleChangeSetFolio}
                    fullWidth
                  />

                  <TextField
                    label="Tel & Email"
                    name="origen_correo"
                    variant="outlined"
                    size="small"
                    value={folio.origen_correo}
                    slotProps={{
                      input: {
                        inputProps: { maxLength: 99 },
                      },
                    }}
                    onChange={handleChangeSetFolio}
                    fullWidth
                  />
                </Paper>

                {/* CARD DESTINO */}
                <Paper
                  elevation={6}
                  sx={{
                    flex: 1,
                    minWidth: 340,
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    gap: 3,
                    borderRadius: 4,
                    backgroundColor: "#fafafa",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1, color: "#1976d2" }}
                  >
                    Destino
                  </Typography>

                  <FormControl fullWidth>
                    <InputLabel>Destino Location</InputLabel>
                    <Select
                      value={locacionSelected}
                      onChange={handleChangeLocacion}
                      label="Destino Location"
                    >
                      {locaciones.map((loc) => (
                        <MenuItem key={loc.id} value={loc.id}>
                          {loc.locacion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Dirección"
                    variant="outlined"
                    size="small"
                    value={direccion}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label="Contacto"
                    name="destino_contacto"
                    variant="outlined"
                    size="small"
                    value={folio.destino_contacto}
                    slotProps={{
                      input: {
                        inputProps: { maxLength: 99 },
                      },
                    }}
                    onChange={handleChangeSetFolio}
                    fullWidth
                  />

                  <TextField
                    label="Tel & Email"
                    name="destino_correo"
                    variant="outlined"
                    size="small"
                    value={folio.destino_correo}
                    slotProps={{
                      input: {
                        inputProps: { maxLength: 99 },
                      },
                    }}
                    onChange={handleChangeSetFolio}
                    fullWidth
                  />
                </Paper>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  minWidth: 340,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  gap: 1,
                  borderRadius: 4,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Título */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 0, color: "#1976d2" }}
                >
                  Datos de Envío
                </Typography>

                {/* Campos en columna */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {/* SELLO */}
                  <TextField
                    name="sello"
                    size="small"
                    variant="outlined"
                    label="Sello"
                    value={folio.sello}
                    slotProps={{
                      input: {
                        inputProps: { maxLength: 99 },
                      },
                    }}
                    onChange={handleChangeSetFolio}
                    fullWidth
                  />

                  {/* TRANSPORTISTA */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Transportista</InputLabel>
                    <Select
                      value={selectedTransportista}
                      onChange={handleChangeTransportista}
                      label="Transportista"
                    >
                      {transportistas.map((t) => (
                        <MenuItem key={t.id} value={t.transportista}>
                          {t.transportista}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* MODO ENVÍO */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Modo Envío</InputLabel>
                    <Select
                      value={selectedEnvio}
                      onChange={handleChangeEnvio}
                      label="Modo Envío"
                    >
                      {envio.map((e) => (
                        <MenuItem key={e.id} value={e.modo_envio}>
                          {e.modo_envio}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* CAJA */}
                  <TextField
                    name="caja"
                    size="small"
                    variant="outlined"
                    label="Caja #"
                    value={folio.caja}
                    slotProps={{
                      input: {
                        inputProps: { maxLength: 99 },
                      },
                    }}
                    onChange={handleChangeSetFolio}
                    fullWidth
                  />
                  {/* INCOTERM */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Incoterm</InputLabel>
                    <Select
                      value={incotermSelected}
                      onChange={handleChangeincoterm}
                      label="Incoterm"
                    >
                      {incoterm.map((i) => (
                        <MenuItem key={i.id} value={i.incoterm}>
                          {i.incoterm}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* TIPO MATERIAL */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Tipo Material</InputLabel>
                    <Select
                      value={tipo_materialSelected}
                      onChange={handleChangetipo_material}
                      label="Tipo Material"
                    >
                      {tipo_material.map((m) => (
                        <MenuItem key={m.id} value={m.tipo_material}>
                          {m.tipo_material}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* RAZÓN */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Razón</InputLabel>
                    <Select
                      value={razonSelected}
                      onChange={handleChangeRazon}
                      label="Razón"
                    >
                      {razon.map((r) => (
                        <MenuItem key={r.id} value={r.razon}>
                          {r.razon}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  minWidth: 340,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  gap: 1,
                  borderRadius: 4,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Título */}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 0, color: "#1976d2" }}
                >
                  Datos Adicionales
                </Typography>

                {/* Campos en columna */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* TEMPORAL O DEFINITIVO */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Temporal o Definitivo</InputLabel>
                    <Select
                      value={valor}
                      onChange={handleChangeTemODef}
                      label="Temporal o Definitivo"
                    >
                      <MenuItem value="Temporal">Temporal</MenuItem>
                      <MenuItem value="Definitivo">Definitivo</MenuItem>
                    </Select>
                  </FormControl>

                  {/* FECHA DE RETORNO */}
                  {fechaVisible && (
                    <TextField
                      name="fecha_retorno"
                      type="date"
                      size="small"
                      variant="outlined"
                      value={folio.fecha_retorno}
                      onChange={(e) =>
                        setFolio({ ...folio, fecha_retorno: e.target.value })
                      }
                      label="Fecha de Retorno"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  )}

                  {/* COST CENTER */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Cost Center</InputLabel>
                    <Select
                      value={costCenterSelected}
                      onChange={handleChangeCostCenter}
                      label="Cost Center"
                    >
                      {costCenter.map((m) => (
                        <MenuItem key={m.id} value={m.cost_center}>
                          {m.cost_center}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* COST CENTER NAME */}
                  <TextField
                    name="cost_center_name"
                    value={costCenterName}
                    size="small"
                    variant="outlined"
                    label="Cost Center Name"
                    fullWidth
                    disabled
                  />

                  {/* CATEGORÍA */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={valor2}
                      onChange={handleChangeCaT}
                      label="Categoría"
                    >
                      <MenuItem value="Seleccionar">Seleccionar</MenuItem>
                      <MenuItem value="Mpo">Mpo</MenuItem>
                      <MenuItem value="Capex">Capex</MenuItem>
                      <MenuItem value="Otros">Otros</MenuItem>
                    </Select>
                  </FormControl>

                  {/* NUM CAPEX-PO */}
                  <TextField
                    name="capex_po"
                    onChange={handleChangeSetFolio}
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: {
                        inputProps: { maxLength: 99 },
                      },
                    }}
                    label="Num Capex-PO"
                    value={folio.capex_po}
                    fullWidth
                  />
                </Box>
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  minWidth: 340,
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  gap: 9,
                  borderRadius: 4,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <div style={{ height: 300, width: "100%" }}>
                  <div style={{ marginBottom: 3 }}>
                    <Button variant="outlined" onClick={handleClickAbrirModal}>
                      <AddOutlinedIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDelete}
                      disabled={selectedRowId === null}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={(params) => setSelectedRowId(params.id)}
                    disableSelectionOnClick
                  />
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
                      style={{
                        padding: "10px",
                        marginRight: "5px",
                        marginTop: "0",
                      }}
                    >
                      Total cantidad:
                      <br />
                      <center>{totales.cantidad}</center>
                    </Paper>

                    <Paper
                      elevation={3}
                      style={{
                        padding: "10px",
                        marginRight: "5px",
                      }}
                    >
                      Total Valor:
                      <br />
                      <center>{totales.valor}</center>
                    </Paper>
                  </div>
                </div>

                <br />
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  minWidth: 340,
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  gap: 9,
                  borderRadius: 4,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <div style={{ height: 300, width: "100%" }}>
                  <div style={{ marginBottom: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleClickAbrirModalPaqueteria}
                    >
                      <AddOutlinedIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeletePaqueteria}
                      disabled={selectedRowIdPaqueteria === null}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                  <DataGrid
                    rows={rowsPaqueteria}
                    columns={columnsPaqueteria}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={(params) =>
                      setSelectedRowIdPaqueteria(params.id)
                    }
                    disableSelectionOnClick
                  />
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
                      style={{
                        padding: "10px",
                        marginRight: "5px",
                      }}
                    >
                      Total Pallets/Cajas:
                      <br />
                      <center>{totales.pallets_cajas}</center>
                    </Paper>

                    <Paper
                      elevation={3}
                      style={{
                        padding: "10px",
                        marginRight: "5px",
                      }}
                    >
                      Total Peso:
                      <br />
                      <center>{totales.peso}</center>
                    </Paper>
                  </div>
                </div>
                <br />
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
              <Paper
                elevation={6}
                sx={{
                  flex: 1,
                  minWidth: 340,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  gap: 1,
                  borderRadius: 4,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 3, color: "#1976d2" }}
                >
                  Informacion de Responsables
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    name="responsable1"
                    label="Aprobador 1"
                    variant="outlined"
                    value={responsable1}
                    size="small"
                    fullWidth
                    disabled
                  />

                  <TextField
                    name="suplente"
                    label="Aprobador Suplente"
                    variant="outlined"
                    value={suplente}
                    size="small"
                    fullWidth
                    disabled
                  />

                  <TextField
                    name="responsable2"
                    label="Aprobador 2"
                    variant="outlined"
                    value={responsable2}
                    size="small"
                    fullWidth
                    disabled
                  />

                  <Button
                    size="large"
                    variant="contained"
                    disableElevation
                    fullWidth
                    onClick={handleClickGuardarFolio}
                    sx={{ mt: 2 }}
                    disabled={habilitar.boton}
                  >
                    Confirmar
                  </Button>
                </Stack>
              </Paper>
            </CustomTabPanel>
          </Box>
          <Mensaje
            mensaje={mensaje}
            estado={estado}
            open={openError}
            onClose={() => setOpenError(false)}
          />
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        ></div>
      </Box>
    </>
  );
}
const headerStyle = {
  backgroundColor: "rgb(0,66,105)",
  color: "#fff",
  fontSize: "0.65rem",
  height: "50px",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "0.5rem",
};
const styleTarget = {
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputLabel-root": {
    fontSize: "12px", // Cambia el tamaño del label
  },
  "& .MuiInputBase-input": {
    fontSize: "10sdpx", // Cambia el tamaño del texto de entrada
  },
  "& .MuiSelect-select": {
    fontSize: "14px", // Cambia el tamaño del texto seleccionado
  },
};
const textFieldStyles = {
  "& .MuiInputBase-input": {
    color: "black", // Texto en negro
  },
  /*  "& .MuiInputLabel-root": {
    color: "black", // Label en negro
  }, */
  /* "& .MuiInput-underline:before": {
    borderBottomColor: "black", // Línea inferior en negro
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "black",
  }, */
};

export default NuevoFolio;
