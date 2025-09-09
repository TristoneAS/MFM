import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request) {
  try {
    const { locacion, direccion, documento } = await request.json();

    const resultado = await conn.query("INSERT INTO locacion SET ?", {
      locacion,
      direccion,
      documento,
    });

    return NextResponse.json({
      locacion,

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    let query = "SELECT * from locacion order by id asc";
    let params = [];

    if (id) {
      query = "SELECT * from locacion WHERE id = ? order by id asc";
      params = [id];
    }

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
