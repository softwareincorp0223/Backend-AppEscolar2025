import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SesionesApp = sequelize.define("SesionesApp", {
  sesiones_app: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_padre: { type: DataTypes.STRING(10),  allowNull: false },
  token_sesion: { type: DataTypes.STRING(250),  allowNull: false },
  fecha_inicio: { type: DataTypes.DATEONLY,  allowNull: false }
}, { tableName: "sesiones_app", timestamps: false });

export default SesionesApp;