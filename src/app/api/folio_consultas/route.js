import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { empleados } from "@/libs/empleados";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const emp_id = searchParams.get("emp_id");
    const folio_id = searchParams.get("folio_id");
    let query =
      "SELECT folio_id,fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2 from folios where ((responsable1=? or suplente=?) and (status_1='pendiente' and status_S='pendiente')) or ((responsable2=?&&status_2='pendiente') and (status_1='Aprobado' or status_S='Aprobado') ) ";
    let params = [emp_id, emp_id, emp_id];

    if (folio_id) {
      query = "SELECT * from folios WHERE folio_id = ? ";
      params = [folio_id];
    }

    const [rows] = await conn.query(query, params);
    for (const eachRow of rows) {
      const empQuery = "SELECT emp_nombre FROM del_empleados WHERE emp_id = ?";
      const empParams = [eachRow.responsable1];

      const empParamsS = [eachRow.suplente];
      const empParams2 = [eachRow.responsable2];
      const empParams3 = [eachRow.creado_por];

      const [empResult] = await empleados.query(empQuery, empParams);
      const [empResults] = await empleados.query(empQuery, empParamsS);
      const [empResult2] = await empleados.query(empQuery, empParams2);
      const [empResult3] = await empleados.query(empQuery, empParams3);

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
      if (empResult3.length > 0) {
        let nombre3 = empResult3[0].emp_nombre;
        eachRow.creado_por = nombre3;
      }
    }
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
