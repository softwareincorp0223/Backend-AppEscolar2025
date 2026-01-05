import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Grado from "./grado.js"

const Grupo = sequelize.define("Grupo", {
  id_grupo: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_grado: { type: DataTypes.STRING(20),  allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true }
}, { tableName: "grupo", timestamps: false });

Grupo.belongsTo(Grado, { foreignKey: "sid_grado" });

export default Grupo;