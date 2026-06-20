import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaAsignarMensajeAlumno = sequelize.define(
  "VistaAsignarMensajeAlumno",
  {
    id_asignar_mensaje: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_mensaje: DataTypes.STRING(20),
    sid_alumno: DataTypes.STRING(20),
    sid_instituto: DataTypes.STRING(20),

    padre: DataTypes.STRING(255),
    matricula: DataTypes.STRING(255),
    estudiante: DataTypes.STRING(255),

    nivel: DataTypes.STRING(255),
    grado: DataTypes.STRING(255),
    grupo: DataTypes.STRING(255),

    respuesta_rapida: DataTypes.STRING(20),
    leido: DataTypes.STRING(20),
  },
  {
    tableName: "vista_asignar_mensaje_alumno",
    timestamps: false,
  }
);

export default VistaAsignarMensajeAlumno;