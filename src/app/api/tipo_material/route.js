import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { empleados } from "@/libs/empleados";
export async function POST(request) {
  try {
    const { tipo_material, responsable1, suplente, responsable2 } =
      await request.json();

    const resultado = await conn.query("INSERT INTO tipo_material SET ?", {
      tipo_material,
      responsable1,
      suplente,
      responsable2,
    });

    return NextResponse.json({
      tipo_material,

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
    const tipo_material = searchParams.get("tipo_material");
    const id = searchParams.get("id");
    let query = "SELECT * from tipo_material order by id asc";
    let params = [];

    if (id) {
      query = "SELECT * from tipo_material WHERE id = ? order by id asc";
      params = [id];
    }
    if (tipo_material) {
      query = "SELECT * from tipo_material WHERE tipo_material = ?";
      params = [tipo_material];
    }
    const [rows] = await conn.query(query, params);
    for (const eachRow of rows) {
      const empQuery = "SELECT emp_nombre FROM del_empleados WHERE emp_id = ?";
      const empParams = [eachRow.responsable1];

      const empParamsS = [eachRow.suplente];
      const empParams2 = [eachRow.responsable2];

      const [empResult] = await empleados.query(empQuery, empParams);
      const [empResults] = await empleados.query(empQuery, empParamsS);
      const [empResult2] = await empleados.query(empQuery, empParams2);

      if (empResult.length > 0) {
        let nombre = empResult[0].emp_nombre;
        eachRow.responsable1 = nombre;
      }
      if (empResults.length > 0) {
        let nombreS = empResults[0].emp_nombre;
        eachRow.suplente = nombreS;
      }
      if (empResult2.length > 0) {
        let nombre2 = empResult2[0].emp_nombre;
        eachRow.responsable2 = nombre2;
      }
    }

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
