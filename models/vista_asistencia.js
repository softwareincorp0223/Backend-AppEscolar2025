import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaAsistencia = sequelize.define("VistaAsistencia", {
  id_asistencia: { type: DataTypes.STRING(20), primaryKey: true, },
  sid_alumno: { type: DataTypes.STRING(20), },
  fecha_ingreso: { type: DataTypes.DATE, },
  hora: { type: DataTypes.STRING(20), },
  tipo: { type: DataTypes.STRING(50), },
  sid_usuario: { type: DataTypes.STRING(20), },
  sid_instituto: { type: DataTypes.STRING(20), },
  nombre_alumno: { type: DataTypes.STRING(150), },
  apellido_alumno: { type: DataTypes.STRING(150), },
  matricula: { type: DataTypes.STRING(50), },
  nombre_nivel: { type: DataTypes.STRING(150), },
  nombre_grado: { type: DataTypes.STRING(150), },
  nombre_grupo: { type: DataTypes.STRING(150), },
  nombre_usuario: { type: DataTypes.STRING(150), },
  apellido_usuario: { type: DataTypes.STRING(150), },
},
  { tableName: "vista_asistencia", timestamps: false, freezeTableName: true, });

export default VistaAsistencia;
