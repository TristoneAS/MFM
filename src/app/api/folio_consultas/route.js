import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import { empleados } from "@/libs/empleados";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const emp_id = searchParams.get("emp_id");
    const esperando = searchParams.get("Esperando") === "true";
    const folio_id = searchParams.get("folio_id");
    const aprobados = searchParams.get("Aprobados") === "true";
    const rechazados = searchParams.get("Rechazados") === "true";
    const revisar = searchParams.get("Revisar") === "true";
    const retornos = searchParams.get("retornos") === "true";
    const vertodo = searchParams.get("vertodo") === "true";
    const misAprobados = searchParams.get("misAprobados") === "true";
    const misRechazados = searchParams.get("misRechazados") === "true";
    const misRetornados = searchParams.get("misRetornados") === "true";
    let query =
      "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2 from folios where ((responsable1=? or suplente=?) and (status_1='pendiente' and status_S='pendiente')) or ((responsable2=?&&status_2='pendiente') and (status_1='Aprobado' or status_S='Aprobado') ) ";
    let params = [emp_id, emp_id, emp_id];
    if (revisar) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where ((responsable1=? or suplente=?) and (status_1='pendiente' and status_S='pendiente')) or ((responsable2=?&&status_2='pendiente') and (status_1='Aprobado' or status_S='Aprobado') )  ";
      params = [emp_id, emp_id, emp_id];
    }
    if (folio_id) {
      query = "SELECT * from folios WHERE folio_id = ? ";
      params = [folio_id];
    }
    if (esperando) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where ((creado_por=?) and ((status_1='pendiente' and status_S='pendiente') or ((status_1!='Rechazado' and status_S!='Rechazado') and status_2='pendiente')))";
      params = [emp_id];
    }
    if (aprobados) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where creado_por=? and((status_1='Aprobado' or status_S='Aprobado') and status_2='Aprobado') ";
      params = [emp_id];
    }
    if (rechazados) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where creado_por=? and((status_1='Rechazado' or status_S='Rechazado') or status_2='Rechazado')";
      params = [emp_id];
    }
    if (retornos) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,DATE_FORMAT(fecha_retorno,'%Y-%m-%d') AS fecha_retorno,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where (creado_por=? or responsable1=? or suplente=? or responsable2=?) and ((status_1='Aprobado' or status_S='Aprobado') and status_2='Aprobado') and (fecha_retorno!=0000-00-00) and liberado='false'";
      params = [emp_id, emp_id, emp_id, emp_id];
    }
    if (vertodo) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios ";
      params = [];
    }
    if (misAprobados) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where (responsable1=? and status_1='Aprobado') or (suplente=? and status_S='Aprobado') or (responsable2=? and status_2='Aprobado') ";
      params = [emp_id, emp_id, emp_id];
    }
    if (misRechazados) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where (responsable1=? and status_1='Rechazado') or (suplente=? and status_S='Rechazado') or (responsable2=? and status_2='Rechazado') ";
      params = [emp_id, emp_id, emp_id];
    }
    if (misRetornados) {
      query =
        "SELECT folio_id,DATE_FORMAT(fecha,'%Y-%m-%d') AS fecha,creado_por,responsable1,status_1,suplente,status_S,responsable2,status_2,liberado,DATE_FORMAT(fecha_regreso,'%Y-%m-%d') AS fecha_regreso, DATEDIFF(fecha_retorno, CURDATE()) AS dias_restantes, CASE WHEN DATEDIFF(fecha_retorno, CURDATE()) < 0 THEN 'Vencido'   WHEN DATEDIFF(fecha_retorno, CURDATE()) = 0 THEN 'Hoy'  WHEN DATEDIFF(fecha_retorno, CURDATE()) BETWEEN 1 AND 5 THEN 'Próximos 5 días' ELSE 'Más de 5 días' END AS estado_retorno from folios where retornado_por=? ";
      params = [emp_id];
    }
    const [rows] = await conn.query(query, params);
    for (const eachRow of rows) {
      // guardar ids originales antes de sobrescribir
      eachRow.responsable1_id = eachRow.responsable1;
      eachRow.suplente_id = eachRow.suplente;
      eachRow.responsable2_id = eachRow.responsable2;
      eachRow.creado_por_id = eachRow.creado_por;

      const empQuery = "SELECT emp_nombre FROM del_empleados WHERE emp_id = ?";

      const [empResult] = await empleados.query(empQuery, [
        eachRow.responsable1,
      ]);
      const [empResults] = await empleados.query(empQuery, [eachRow.suplente]);
      const [empResult2] = await empleados.query(empQuery, [
        eachRow.responsable2,
      ]);
      const [empResult3] = await empleados.query(empQuery, [
        eachRow.creado_por,
      ]);

      if (empResult.length > 0) eachRow.responsable1 = empResult[0].emp_nombre;
      if (empResults.length > 0) eachRow.suplente = empResults[0].emp_nombre;
      if (empResult2.length > 0)
        eachRow.responsable2 = empResult2[0].emp_nombre;
      if (empResult3.length > 0) eachRow.creado_por = empResult3[0].emp_nombre;
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
