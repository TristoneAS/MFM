import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { empleados } from "@/libs/empleados";

export async function POST(req) {
  try {
    const paqueteria = await req.json();

    if (!Array.isArray(paqueteria) || paqueteria.length === 0) {
      return NextResponse.json({ message: "Datos inválidos" }, { status: 400 });
    }
    const values = paqueteria.map((mat) => [
      mat.folio_id,
      mat.pallets_cajas,
      mat.peso,
      mat.total_peso,
      mat.dimensiones,
    ]);

    const query = `
  INSERT INTO paqueteria (
    folio_id,
    pallets_cajas,
    peso,
    total_peso,
    dimensiones
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folio_id = searchParams.get("folio_id");

    let query = "SELECT * from paqueteria WHERE folio_id = ? ";
    let params = [folio_id];

    const [rows] = await conn.query(query, params);
    console.log(rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
