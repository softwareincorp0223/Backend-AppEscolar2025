import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AsignarMensaje = sequelize.define("AsignarMensaje", {
  id_asignar_mensaje: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
  sid_alumno: { type: DataTypes.STRING(20),  allowNull: false },
  sid_mensaje: { type: DataTypes.STRING(20),  allowNull: false },
  respuesta_rapida: { type: DataTypes.STRING(20),  allowNull: true },
  leido: { type: DataTypes.STRING(20),  allowNull: false }
}, { tableName: "asignar_mensaje", timestamps: false });

export default AsignarMensaje;