import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AsignarClase = sequelize.define("AsignarClase", {
  id_asignar_clase: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_materia: { type: DataTypes.STRING(20),  allowNull: true },
  sid_profesor: { type: DataTypes.STRING(20),  allowNull: true },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "asignar_clase", timestamps: false });

export default AsignarClase;