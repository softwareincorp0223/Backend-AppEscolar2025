import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Penalidad = sequelize.define("Penalidad", {
  id_penalidad: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  porcentaje: { type: DataTypes.INTEGER,  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "penalidad", timestamps: false });

export default Penalidad;