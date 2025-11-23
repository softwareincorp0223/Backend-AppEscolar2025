import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Rol = sequelize.define("Rol", {
  id_rol: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true },
  nombre: { type: DataTypes.STRING(100),  allowNull: true },
  fecha_registro: { type: DataTypes.DATEONLY,  allowNull: true }
}, { tableName: "rol", timestamps: false });

export default Rol;