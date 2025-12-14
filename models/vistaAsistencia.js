import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaAsistencia = sequelize.define(
  "VistaAsistencia",
  {
    id_asistencia: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_alumno: DataTypes.STRING(20),
    sid_usuario: DataTypes.STRING(20),
    sid_instituto: DataTypes.STRING(20),

    fecha_ingreso: DataTypes.DATEONLY,
    hora: DataTypes.TIME,
    tipo: DataTypes.STRING(100),

    nombre_alumno: DataTypes.STRING(100),
    apellido_alumno: DataTypes.STRING(100),
    matricula: DataTypes.STRING(50),

    sid_nivel: DataTypes.STRING(20),
    sid_grado: DataTypes.STRING(20),
    sid_grupo: DataTypes.STRING(20),

    nombre_nivel: DataTypes.STRING(100),
    nombre_grado: DataTypes.STRING(100),
    nombre_grupo: DataTypes.STRING(50),

    nombre_usuario: DataTypes.STRING(100),
    apellido_usuario: DataTypes.STRING(100),
  },
  {
    tableName: "vista_asistencia_node",
    timestamps: false,
  }
);

export default VistaAsistencia;
