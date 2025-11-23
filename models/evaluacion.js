import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Evaluacion = sequelize.define("Evaluacion", {
  id_evaluacion: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_alumno: { type: DataTypes.STRING(10),  allowNull: false },
  promedio_general: { type: DataTypes.STRING(10),  allowNull: false },
  promedio_final: { type: DataTypes.STRING(10),  allowNull: false },
  ciclo: { type: DataTypes.STRING(20),  allowNull: false },
  fecha_registro: { type: DataTypes.DATEONLY,  allowNull: false },
  leido: { type: DataTypes.STRING(10),  allowNull: true }
}, { tableName: "evaluacion", timestamps: false });

export default Evaluacion;