// lib/db.js
import mysql from "mysql2/promise";

export const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  database: "material_flow_manager",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
