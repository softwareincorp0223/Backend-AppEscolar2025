import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RegistroMensajes = sequelize.define("RegistroMensajes", {
  id_registro_mensajes: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false },
  sid_mensaje: { type: DataTypes.STRING(50),  allowNull: false },
  responsable: { type: DataTypes.STRING(50),  allowNull: false },
  fecha_eliminacion: { type: DataTypes.DATE,  allowNull: false }
}, { tableName: "registro_mensajes", timestamps: false });

export default RegistroMensajes;