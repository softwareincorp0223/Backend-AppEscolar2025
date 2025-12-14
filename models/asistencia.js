import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";
import Usuario from "./Usuario.js";

const Asistencia = sequelize.define("Asistencia", {
  id_asistencia: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_alumno: { type: DataTypes.STRING(20),  allowNull: true },
  fecha_ingreso: { type: DataTypes.DATEONLY,  allowNull: true },
  hora: { type: DataTypes.TIME,  allowNull: true },
  tipo: { type: DataTypes.STRING(100),  allowNull: true },
  leido: { type: DataTypes.STRING(10),  allowNull: true },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "asistencia", timestamps: false });

Asistencia.belongsTo(Alumno, { foreignKey: "sid_alumno" });
Asistencia.belongsTo(Usuario, { foreignKey: "sid_usuario" });


Alumno.hasMany(Asistencia, { foreignKey: "sid_alumno" });

export default Asistencia;