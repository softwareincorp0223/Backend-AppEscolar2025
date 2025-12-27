import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaRegistroMensajes = sequelize.define(
  "VistaRegistroMensajes",
  {
    id_mensaje: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_instituto: {
      type: DataTypes.STRING(20),
    },

    eliminado: {
      type: DataTypes.BOOLEAN,
    },

    asunto: {
      type: DataTypes.STRING(200),
    },

    fecha_envio: {
      type: DataTypes.DATE,
    },

    nombre_usuario: {
      type: DataTypes.STRING(150),
    },

    apellido_usuario: {
      type: DataTypes.STRING(150),
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

    fecha_eliminacion: {
      type: DataTypes.DATE,
    },

    responsable: {
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: "vista_registro_mensajes",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaRegistroMensajes;
