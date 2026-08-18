import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaMensajes = sequelize.define(
  "VistaMensajes",
  {
    id_mensaje: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    receptor: {
      type: DataTypes.STRING(100),
    },

    destinatarios: {
      type: DataTypes.TEXT,
    },

    asunto: {
      type: DataTypes.STRING(200),
    },

    fecha_envio: {
      type: DataTypes.DATE,
    },

    mensaje_programado: {
      type: DataTypes.STRING(5),
    },

    eliminado: {
      type: DataTypes.STRING(20),
    },

    sid_instituto: { 
      type: DataTypes.STRING(20),
      field: "instituto_id",
    },

    nombre_tipo: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "vista_mensajes",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaMensajes;
