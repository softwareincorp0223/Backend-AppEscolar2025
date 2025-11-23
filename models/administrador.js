import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Administrador = sequelize.define("Administrador", {
  id_admin: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  apellido: { type: DataTypes.STRING(250),  allowNull: true },
  correo: { type: DataTypes.STRING(100),  allowNull: true },
  contrasena: { type: DataTypes.STRING(250),  allowNull: false },
  privilegios: { type: DataTypes.STRING(20),  allowNull: true },
}, { tableName: "administrador", timestamps: false });

export default Administrador;