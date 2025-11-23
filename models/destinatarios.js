import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Destinatarios = sequelize.define("Destinatarios", {
  id_destinatarios: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_alumno: { type: DataTypes.STRING(10),  allowNull: false },
  sid_mensaje: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "destinatarios", timestamps: false });

export default Destinatarios;