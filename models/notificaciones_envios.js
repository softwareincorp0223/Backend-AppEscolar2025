import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const NotificacionesEnvios = sequelize.define(
  "NotificacionesEnvios",
  {
    id_envio: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
    tipo_modulo: { type: DataTypes.STRING(40), allowNull: false },
    sid_referencia: { type: DataTypes.STRING(20), allowNull: false },
    id_padre: { type: DataTypes.STRING(20), allowNull: false },
    token_dispositivo: { type: DataTypes.STRING(250), allowNull: false },
    fecha_programada: { type: DataTypes.DATE, allowNull: true },
    fecha_enviada: { type: DataTypes.DATE, allowNull: true },
    estatus: { type: DataTypes.STRING(30), allowNull: false },
    error: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true },
    updated_at: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "notificaciones_envios", timestamps: false }
);

export default NotificacionesEnvios;
