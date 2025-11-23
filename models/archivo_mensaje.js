import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ArchivoMensaje = sequelize.define("ArchivoMensaje", {
  id_archivo_mensaje: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_mensaje: { type: DataTypes.STRING(20),  allowNull: true },
  url: { type: DataTypes.STRING(250),  allowNull: true }
}, { tableName: "archivo_mensaje", timestamps: false });

export default ArchivoMensaje;