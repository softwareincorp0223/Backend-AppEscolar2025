import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaSeguimientos = sequelize.define(
  "VistaSeguimientos",
  {
    id_seguimiento: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    fecha_registro: {
      type: DataTypes.DATE,
    },

    leido: {
      type: DataTypes.BOOLEAN,
    },

    fecha_visto: {
      type: DataTypes.DATE,
    },

    fecha_eliminacion: {
      type: DataTypes.DATE,
    },

    eliminado: {
      type: DataTypes.BOOLEAN,
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

    nombre_usuario: {
      type: DataTypes.STRING(150),
    },

    apellido_usuario: {
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: "vista_seguimientos",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaSeguimientos;
