import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DispositivosPadre = sequelize.define("DispositivosPadre", {
  id_dispositivos_padre: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  id_padre: { type: DataTypes.STRING(10),  allowNull: false },
  token_dispositivo: { type: DataTypes.STRING(250),  allowNull: false },
  badge_notificaciones: { type: DataTypes.INTEGER,  allowNull: true }
}, { tableName: "dispositivos_padre", timestamps: false });

export default DispositivosPadre;