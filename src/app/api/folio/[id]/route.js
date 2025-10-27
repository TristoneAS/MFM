import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { createdby, status, liberar, fecha_regreso, emp_id } = body;

    // Buscar el folio
    const [rows] = await conn.query("SELECT * FROM folios WHERE folio_id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Folio no encontrado" },
        { status: 404 }
      );
    }

    const folio = rows[0];
    let result = null;

    // Verificar y actualizar según coincidencia
    if (folio.responsable1 === createdby) {
      [result] = await conn.query(
        "UPDATE folios SET status_1='" +
          [status] +
          "', status_S='NA' WHERE folio_id = ?",
        [id]
      );
    }
    if (folio.suplente === createdby) {
      [result] = await conn.query(
        "UPDATE folios SET status_S='" +
          [status] +
          "',status_1='NA' WHERE folio_id = ?",
        [id]
      );
    }
    if (folio.responsable1 === createdby && folio.suplente === createdby) {
      [result] = await conn.query(
        "UPDATE folios SET status_1='" +
          [status] +
          "', status_S='" +
          [status] +
          "' WHERE folio_id = ?",
        [id]
      );
    }
    if (folio.responsable2 === createdby) {
      [result] = await conn.query(
        "UPDATE folios SET status_2='" + [status] + "' WHERE folio_id = ?",
        [id]
      );
    }
    if (liberar === "true") {
      [result] = await conn.query(
        "UPDATE folios SET liberado='" +
          [liberar] +
          "',fecha_regreso='" +
          [fecha_regreso] +
          "',retornado_por='" +
          [emp_id] +
          "' WHERE folio_id = ?",
        [id]
      );
    }

    if (!result || result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No se pudo actualizar" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Estado actualizado", folioId: id });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
