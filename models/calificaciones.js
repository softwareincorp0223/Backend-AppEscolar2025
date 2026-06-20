import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Evaluacion from "./evaluacion.js";
import Materia from "./materia.js";

const Calificaciones = sequelize.define("Calificaciones", {
  id_calificaciones: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_evaluacion: { type: DataTypes.STRING(10),  allowNull: false },
  sid_materia: { type: DataTypes.STRING(10),  allowNull: false },
  calificacion: { type: DataTypes.STRING(10),  allowNull: false },
  periodo: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "calificaciones", timestamps: false });

Calificaciones.belongsTo(Evaluacion, { foreignKey: "sid_evaluacion" });
Evaluacion.hasMany(Calificaciones, {foreignKey: "sid_evaluacion"});
Calificaciones.belongsTo(Materia, {as: "Materia", foreignKey: "sid_materia"});
Materia.hasMany(Calificaciones, {foreignKey: "sid_materia"});

export default Calificaciones;