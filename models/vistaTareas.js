import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaTareas = sequelize.define(
  "VistaTareas",
  {
    id_tareas: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_instituto: {
      type: DataTypes.STRING(20),
    },
    
    id_nivel: {
      type: DataTypes.STRING(20),
    },

    id_grado: {
      type: DataTypes.STRING(20),
    },

    id_grupo: {
      type: DataTypes.STRING(20),
    },

    nombre_profesor: {
      type: DataTypes.STRING(100),
    },

    apellido_profesor: {
      type: DataTypes.STRING(100),
    },

    materia: {
      type: DataTypes.STRING(100),
    },

    nombre_nivel: {
      type: DataTypes.STRING(100),
    },

    nombre_grado: {
      type: DataTypes.STRING(100),
    },

    nombre_grupo: {
      type: DataTypes.STRING(50),
    },

    instrucciones_tarea: {
      type: DataTypes.TEXT,
    },

    fecha_creacion: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "vista_tareas_node",
    timestamps: false,
  }
);

export default VistaTareas;
