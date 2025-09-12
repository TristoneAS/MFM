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
export async function POST(request) {
  try {
    const {
      fecha,
      origen_location,
      origen_direccion,
      origen_contacto,
      origen_correo,
      destino_location,
      destino_direccion,
      destino_contacto,
      destino_correo,
      sello,
      transportista,
      modo_envio,
      caja,
      incoterm,
      tipo_material,
      razon,
      permanente_temporal,
      fecha_retorno,
      creado_por,
      cost_center,
      cost_center_name,
      categoria,
      capex_po,
      responsable1,
      status_1,
      suplente,
      status_S,
      responsable2,
      status_2,
      total_cantidad,
      total_pallets_cajas,
      total_peso,
      total_valor,
      documento,
      liberado,
    } = await request.json();

    const query = "SELECT emp_id FROM del_empleados WHERE emp_nombre = ?";

    // Buscar los IDs correspondientes
    const [[r1]] = await empleados.query(query, [responsable1]);
    const [[s1]] = await empleados.query(query, [suplente]);
    const [[r2]] = await empleados.query(query, [responsable2]);

    const responsable1_id = r1?.emp_id ?? null;
    const suplente_id = s1?.emp_id ?? null;
    const responsable2_id = r2?.emp_id ?? null;

    // Insertar en la tabla folios
    const resultado = await conn.query("INSERT INTO folios SET ?", {
      fecha,
      origen_location,
      origen_direccion,
      origen_contacto,
      origen_correo,
      destino_location,
      destino_direccion,
      destino_contacto,
      destino_correo,
      sello,
      transportista,
      modo_envio,
      caja,
      incoterm,
      tipo_material,
      razon,
      permanente_temporal,
      fecha_retorno,
      creado_por,
      cost_center,
      cost_center_name,
      categoria,
      capex_po,
      responsable1: responsable1_id,
      status_1,
      suplente: suplente_id,
      status_S,
      responsable2: responsable2_id,
      status_2,
      total_cantidad,
      total_pallets_cajas,
      total_peso,
      total_valor,
      documento,
      liberado,
    });

    return NextResponse.json({
      id: resultado[0].insertId,
      responsable1: responsable1_id,
      suplente: suplente_id,
      responsable2: responsable2_id,
      resultado,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
