import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaHistorialMensajes = sequelize.define(
  "VistaHistorialMensajes",
  {
    id_mensaje: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    receptor: {
      type: DataTypes.STRING(100),
    },

    fecha_envio: {
      type: DataTypes.DATE,
    },

    id_instituto: {
      type: DataTypes.STRING(20),
    },

    nombre_instituto: {
      type: DataTypes.STRING(150),
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

    tipo_mensaje: {
      type: DataTypes.STRING(100),
    },

    extracurricular: {
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: "vista_historial_mensajes",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaHistorialMensajes;
