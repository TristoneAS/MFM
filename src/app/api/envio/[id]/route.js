import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    console.log(id);
    const result = await conn.query("DELETE from modo_envio where id=?", [id]);
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
export async function PUT(request, context) {
  try {
    const data = await request.json();
    const { id } = await context.params;

    const result = await conn.query("UPDATE modo_envio SET ? WHERE id = ?", [
      data,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    const consulta = await conn.query("SELECT * from modo_envio where id=?", [
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
