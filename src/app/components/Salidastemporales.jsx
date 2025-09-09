"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function Entradas_Salidas() {
  const [rows, setRows] = useState([]);
  const columns = [
    { field: "folio_id", headerName: "Folio_id", width: 90 },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 150,
      editable: false,
    },
    {
      field: "responsable1",
      headerName: "Aprobador",
      width: 200,
      editable: false,
    },
    {
      field: "status_1",
      headerName: "status",
      width: 200,
      editable: false,
    },
    {
      field: "suplente",
      headerName: "Suplente",
      width: 200,
      editable: false,
    },
    {
      field: "status_S",
      headerName: "status",
      width: 200,
      editable: false,
    },
    {
      field: "responsable2",
      headerName: "Aprobador 2",
      width: 200,
      editable: false,
    },
    {
      field: "status_2",
      headerName: "status",
      width: 200,
      editable: false,
    },
  ];
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
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.folio_id}
          //onRowClick={(params) => handleClickRow(params)}
          disableSelectionOnClick
          //processRowUpdate={handleRowUpdate}
        />
      </div>
    </>
  );
}

export default Entradas_Salidas;
