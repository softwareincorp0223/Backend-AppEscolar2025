import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaTareas2 = sequelize.define(
  "VistaTareas2",
  {
    id_tareas: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_grado: {
      type: DataTypes.STRING(20),
    },

    sid_grupo: {
      type: DataTypes.STRING(20),
    },

    sid_instituto: {
      type: DataTypes.STRING(20),
    },

    instrucciones_tarea: {
      type: DataTypes.TEXT,
    },

    fecha_creacion: {
      type: DataTypes.DATE,
    },

    nombre_profesor: {
      type: DataTypes.STRING(150),
    },

    apellido_profesor: {
      type: DataTypes.STRING(150),
    },

    materia: {
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
    tableName: "vista_tareas2",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaTareas2;
