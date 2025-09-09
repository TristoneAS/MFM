import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let query = "SELECT * FROM modo_envio ORDER BY id ASC";
    let params = [];

    if (id) {
      query = "SELECT * FROM modo_envio WHERE id = ? ORDER BY id ASC";
      params = [id];
    }

    const [rows] = await conn.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const { modo_envio } = await request.json();

    const resultado = await conn.query("INSERT INTO modo_envio SET ?", {
      modo_envio,
    });

    return NextResponse.json({
      modo_envio,
      id: resultado.insertId,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
