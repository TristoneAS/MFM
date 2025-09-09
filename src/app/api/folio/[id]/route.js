import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

/* export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    console.log(id);
    const result = await conn.query("DELETE from tipo_material where id=?", [
      id,
    ]);
    return result.affectedRows === 0
      ? NextResponse.json(
          { message: "El articulo no fue encontrado" },
          { status: 404 }
        )
      : new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} */
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { createdby, status } = body;
    console.log("Folio:", id);
    console.log("createdby:", createdby);

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
    console.log("El responsable 1", folio.responsable1);
    console.log("El suplente", folio.suplente);
    console.log("El responsable 2", folio.responsable2);
    console.log("El creador", createdby);

    // Verificar y actualizar según coincidencia
    if (folio.responsable1 === createdby) {
      [result] = await conn.query(
        "UPDATE folios SET status_1='" + [status] + "' WHERE folio_id = ?",
        [id]
      );
    }
    if (folio.suplente === createdby) {
      [result] = await conn.query(
        "UPDATE folios SET status_S='" + [status] + "' WHERE folio_id = ?",
        [id]
      );
    }
    if (folio.responsable2 === createdby) {
      [result] = await conn.query(
        "UPDATE folios SET status_2='" + [status] + "' WHERE folio_id = ?",
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
