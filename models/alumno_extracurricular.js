import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js"
import Extracurricular from "./extracurricular.js"


const AlumnoExtracurricular = sequelize.define("AlumnoExtracurricular", {
  id_alumno_extracurricular: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_extracurricular: { type: DataTypes.STRING(20), allowNull: true },
  sid_alumno: { type: DataTypes.STRING(20), allowNull: true },
  fecha_ingreso: { type: DataTypes.DATE, allowNull: true },
}, { tableName: "alumno_extracurricular", timestamps: false });

// definir las relaciones
AlumnoExtracurricular.belongsTo(Alumno, { foreignKey: "sid_alumno" });
AlumnoExtracurricular.belongsTo(Extracurricular, { foreignKey: "sid_extracurricular" });


export default AlumnoExtracurricular;