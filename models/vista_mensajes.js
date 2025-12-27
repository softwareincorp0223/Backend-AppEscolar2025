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
      type: DataTypes.BOOLEAN,
    },

    eliminado: {
      type: DataTypes.BOOLEAN,
    },

    instituto_id: {
      type: DataTypes.STRING(20),
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
