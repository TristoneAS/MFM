/* import mysql from "serverless-mysql";
 */
// db.js
import mysql from "mysql2/promise";

export const empleados = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  database: "empleados",
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones
  queueLimit: 0, // Límite de solicitudes en cola (0 para ilimitado)
});
