import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UrlTarea = sequelize.define("UrlTarea", {
  id_url_tarea: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  sid_tarea: { type: DataTypes.STRING(10),  allowNull: false },
  url: { type: DataTypes.STRING(200),  allowNull: false }
}, { tableName: "url_tarea", timestamps: false });

export default UrlTarea;