import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Calificaciones = sequelize.define("Calificaciones", {
  id_calificaciones: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_evaluacion: { type: DataTypes.STRING(10),  allowNull: false },
  sid_materia: { type: DataTypes.STRING(10),  allowNull: false },
  calificacion: { type: DataTypes.STRING(10),  allowNull: false },
  periodo: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "calificaciones", timestamps: false });

export default Calificaciones;