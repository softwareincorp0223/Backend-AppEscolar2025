import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ArchivoRespuestaTarea = sequelize.define("ArchivoRespuestaTarea", {
  id_archivo_respuesta_tarea: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  archivo: { type: DataTypes.STRING(200),  allowNull: false },
  sid_asignar_tarea: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "archivo_respuesta_tarea", timestamps: false });

export default ArchivoRespuestaTarea;