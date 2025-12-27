import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaAdminPadres = sequelize.define("VistaAdminPadres", {
  id_padre: { type: DataTypes.STRING(20), primaryKey: true, },
  nombre: { type: DataTypes.STRING(150), },
  apellido: { type: DataTypes.STRING(150), },
  correo: { type: DataTypes.STRING(150), },
  creacion: { type: DataTypes.DATE, },
  contrasena: { type: DataTypes.STRING(255), },
  codigo_qr: { type: DataTypes.STRING(255), },
  sid_instituto: { type: DataTypes.STRING(20), },
  nombre_institucion: { type: DataTypes.STRING(150), },
}, { tableName: "vista_admin_padres", timestamps: false, freezeTableName: true, });

export default VistaAdminPadres;
