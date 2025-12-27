import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaCalificaciones = sequelize.define(
  "VistaCalificaciones",
  {
    id_evaluacion: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_alumno: {
      type: DataTypes.STRING(20),
    },

    id_alumno: {
      type: DataTypes.STRING(20),
    },

    promedio_general: {
      type: DataTypes.DECIMAL(5, 2),
    },

    promedio_final: {
      type: DataTypes.DECIMAL(5, 2),
    },

    ciclo: {
      type: DataTypes.STRING(50),
    },

    fecha_registro: {
      type: DataTypes.DATE,
    },

    foto: {
      type: DataTypes.STRING(255),
    },

    sid_instituto: {
      type: DataTypes.STRING(20),
    },

    nombre_alumno: {
      type: DataTypes.STRING(150),
    },

    apellido_alumno: {
      type: DataTypes.STRING(150),
    },

    nombre_nivel: {
      type: DataTypes.STRING(150),
    },

    nombre_grado: {
      type: DataTypes.STRING(150),
    },

    nombre_grupo: {
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: "vista_calificaciones",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaCalificaciones;
