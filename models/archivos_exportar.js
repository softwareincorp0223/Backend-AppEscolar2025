import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ArchivosExportar = sequelize.define("ArchivosExportar", {
  archivos_exportar_id: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  nombre_archivo: { type: DataTypes.STRING(200),  allowNull: false },
  fecha_subida: { type: DataTypes.DATEONLY,  allowNull: false },
  estado: { type: DataTypes.STRING(30),  allowNull: false },
  modulo: { type: DataTypes.STRING(70),  allowNull: false },
  usuario_sid: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "archivos_exportar", timestamps: false });

export default ArchivosExportar;