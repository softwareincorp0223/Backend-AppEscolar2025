import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Rol from "./rol.js";
import Privilegios from "./privilegios.js";

const PrivilegiosRol = sequelize.define("PrivilegiosRol", {
  privilegios_rol_id: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_rol: { type: DataTypes.STRING(10),  allowNull: false },
  sid_privilegios: { type: DataTypes.STRING(10),  allowNull: false },
  activo: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "privilegios_rol", timestamps: false });

PrivilegiosRol.belongsTo(Rol, { foreignKey: "sid_rol" });
PrivilegiosRol.belongsTo(Privilegios, { foreignKey: "sid_privilegios" });
Rol.hasMany(PrivilegiosRol, { foreignKey: "sid_rol" });
Privilegios.hasMany(PrivilegiosRol, { foreignKey: "sid_privilegios" });

export default PrivilegiosRol;
