import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { empleados } from "@/libs/empleados";

export async function PUT(request, context) {
  try {
    const { id } = context.params;
    const data = await request.json();
    console.log("ladata ", data);

    const query = "SELECT emp_id FROM del_empleados WHERE emp_nombre = ?";

    // Buscar los IDs correspondientes
    const [[r1]] = await empleados.query(query, [data.responsable1]);
    const [[s1]] = await empleados.query(query, [data.suplente]);
    const [[r2]] = await empleados.query(query, [data.responsable2]);

    const responsable1_id = r1?.emp_id ?? null;
    const suplente_id = s1?.emp_id ?? null;
    const responsable2_id = r2?.emp_id ?? null;

    // Mapear los IDs a los campos correctos
    const mappedData = {
      ...data,
      creado_por: data.creado_por_id,
      responsable1: responsable1_id,
      responsable2: responsable2_id,
      suplente: suplente_id,
      status_1: "Pendiente",
      status_S: "Pendiente",
      status_2: "Pendiente",
      /*       creado_por: data.creado_por_id || data.creado_por,
       */
    };

    // Eliminar los campos que no existen en la tabla
    delete mappedData.responsable1_id;
    delete mappedData.responsable2_id;
    delete mappedData.suplente_id;
    delete mappedData.creado_por_id;

    // Ajuste para fecha_retorno si es DATE en la base de datos
    if (mappedData.fecha_retorno) {
      mappedData.fecha_retorno = mappedData.fecha_retorno.split("T")[0];
    }

    // Hacer UPDATE en la base de datos
    const result = await conn.query("UPDATE folios SET ? WHERE folio_id=?", [
      mappedData,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Traer el registro actualizado
    const consulta = await conn.query("SELECT * FROM folios WHERE folio_id=?", [
      id,
    ]);

    return NextResponse.json(consulta[0]);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
