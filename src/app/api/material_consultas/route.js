import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folio_id = searchParams.get("folio_id");

    let query = "SELECT * from material WHERE folio_id = ? ";
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
