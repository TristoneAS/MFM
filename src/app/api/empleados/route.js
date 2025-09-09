import { NextResponse } from "next/server";
import { empleados } from "@/libs/empleados";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    let query =
      "SELECT * from del_empleados where emp_categoria='administrativos' and emp_correo!='' order by emp_nombre asc";
    let params = [];

    /*  if (id) {
      query = "SELECT * from del_empleados WHERE id = ? order by id asc";
      params = [id];
    } */

    const [rows] = await empleados.query(query, params); // destructura rows del resultado
    return NextResponse.json(rows); // solo envía los datos de los empleados
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { message: "Error al obtener los empleados", error: error.message },
      { status: 500 }
    );
  }
}
