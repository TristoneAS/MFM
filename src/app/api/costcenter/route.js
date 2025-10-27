import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(request) {
  try {
    const { cost_center, cost_center_name } = await request.json();

    const resultado = await conn.query("INSERT INTO cost_center SET ?", {
      cost_center,
      cost_center_name,
    });

    return NextResponse.json({
      cost_center,
      cost_center_name,
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
    const cost_center = searchParams.get("cost_center");

    let query = "SELECT * from cost_center order by id asc";
    let params = [];

    if (id) {
      query = "SELECT * from cost_center WHERE id = ? order by id asc";
      params = [id];
    }
    if (cost_center) {
      query = "SELECT * from cost_center WHERE cost_center = ?";
      params = [cost_center];
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
