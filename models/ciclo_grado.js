import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CicloGrado = sequelize.define("CicloGrado", {
  id_ciclo_grado: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
  sid_ciclo: { type: DataTypes.STRING(20),  allowNull: false },
  sid_grado: { type: DataTypes.STRING(20),  allowNull: false }
}, { tableName: "ciclo_grado", timestamps: false });

export default CicloGrado;