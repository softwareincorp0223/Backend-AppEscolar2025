import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UrlMensaje = sequelize.define("UrlMensaje", {
  id_url: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_mensaje: { type: DataTypes.STRING(20),  allowNull: true },
  url: { type: DataTypes.STRING(250),  allowNull: true }
}, { tableName: "url_mensaje", timestamps: false });

export default UrlMensaje;