import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaAdminUsuarios = sequelize.define("VistaAdminUsuarios", {
  id_usuario: { type: DataTypes.STRING(20), primaryKey: true, },
  nombre: { type: DataTypes.STRING(150), },
  apellido: { type: DataTypes.STRING(150), },
  correo: { type: DataTypes.STRING(150), },
  creacion: { type: DataTypes.DATE, },
  id_rol: { type: DataTypes.STRING(20), },
  nombre_rol: { type: DataTypes.STRING(100), },
  id_instituto: { type: DataTypes.STRING(20), },
  nombre_instituto: { type: DataTypes.STRING(150), },
},
  { tableName: "vista_admin_usuarios", timestamps: false, freezeTableName: true, });

export default VistaAdminUsuarios;
