import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Scanner = sequelize.define("Scanner", {
  id_scanner: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  apellido: { type: DataTypes.STRING(250),  allowNull: true },
  correo: { type: DataTypes.STRING(250),  allowNull: true },
  usuario: { type: DataTypes.STRING(100),  allowNull: true },
  contrasena: { type: DataTypes.STRING(250),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "scanner", timestamps: false });

export default Scanner;