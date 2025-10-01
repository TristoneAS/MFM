import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    console.log(id);
    const result = await conn.query("DELETE from paqueteria where folio_id=?", [
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
}
export async function GET(request, context) {
  try {
    const { id } = await context.params;
    console.log(id);
    const result = await conn.query(
      "SELECT * from paqueteria WHERE folio_id = ? ",
      [id]
    );
    return result.affectedRows === 0
      ? NextResponse.json(
          { message: "El articulo no fue encontrado" },
          { status: 404 }
        )
      : new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
