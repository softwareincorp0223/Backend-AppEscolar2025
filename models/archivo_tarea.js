import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ArchivoTarea = sequelize.define("ArchivoTarea", {
  id_archivo_tarea: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_tarea: { type: DataTypes.STRING(10),  allowNull: false },
  url: { type: DataTypes.STRING(200),  allowNull: false }
}, { tableName: "archivo_tarea", timestamps: false });

export default ArchivoTarea;