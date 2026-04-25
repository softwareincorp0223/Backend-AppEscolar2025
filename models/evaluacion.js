import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";

const Evaluacion = sequelize.define("Evaluacion", {
  id_evaluacion: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_alumno: { type: DataTypes.STRING(10),  allowNull: false },
  promedio_general: { type: DataTypes.STRING(10),  allowNull: false },
  promedio_final: { type: DataTypes.STRING(10),  allowNull: false },
  ciclo: { type: DataTypes.STRING(20),  allowNull: false },
  fecha_registro: { type: DataTypes.DATEONLY,  allowNull: false },
  leido: { type: DataTypes.STRING(10),  allowNull: true }
}, { tableName: "evaluacion", timestamps: false });


Evaluacion.belongsTo(Alumno, { foreignKey: "sid_alumno" });

Alumno.hasMany(Evaluacion, { foreignKey: "sid_alumno" });

export default Evaluacion;