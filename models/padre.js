import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Padre = sequelize.define("Padre", {
  id_padre: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  apellido: { type: DataTypes.STRING(250),  allowNull: true },
  correo: { type: DataTypes.STRING(250),  allowNull: true },
  creacion: { type: DataTypes.DATE,  allowNull: true },
  contrasena: { type: DataTypes.STRING(250),  allowNull: true },
  codigo_qr: { type: DataTypes.STRING(200),  allowNull: false },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "padre", timestamps: false });

export default Padre;