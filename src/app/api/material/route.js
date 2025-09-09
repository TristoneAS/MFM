import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { empleados } from "@/libs/empleados";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("folio_id");

    let query = "SELECT * FROM folio ORDER BY folio_id ASC";
    let params = [];

    if (id) {
      query =
        "SELECT * FROM modo_envio WHERE folio_id = ? ORDER BY folio_id ASC";
      params = [id];
    }

    const [rows] = await conn.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const materiales = await req.json();

    if (!Array.isArray(materiales) || materiales.length === 0) {
      return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
    }

    // Validación básica (puedes mejorarla si lo necesitas)
    /*   for (const mat of materiales) {
      if (!mat.id || !mat.parte || !mat.descripcion) {
        return NextResponse.json(
          { message: "Campos obligatorios faltantes" },
          { status: 400 }
        );
      }
    } */

    // Convertimos los materiales en un array de arrays para el bulk insert
    const values = materiales.map((mat) => [
      mat.folio_id,
      mat.id,
      mat.parte,
      mat.descripcion,
      mat.cantidad,
      mat.unitValue,
      mat.um,
      mat.valor,
    ]);

    const query = `
      INSERT INTO material (
      folio_id,
        id,
        parte,
        descripcion,
        cantidad,
        unitValue,
        um,
        valor
      ) VALUES ?
    `;

    const [resultado] = await conn.query(query, [values]);

    return NextResponse.json({
      inserted: resultado.affectedRows,
      insertId: resultado.insertId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
