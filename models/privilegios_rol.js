import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PrivilegiosRol = sequelize.define("PrivilegiosRol", {
  privilegios_rol_id: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_rol: { type: DataTypes.STRING(10),  allowNull: false },
  sid_privilegios: { type: DataTypes.STRING(10),  allowNull: false },
  activo: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "privilegios_rol", timestamps: false });

export default PrivilegiosRol;