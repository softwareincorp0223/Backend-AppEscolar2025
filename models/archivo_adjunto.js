import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ArchivoAdjunto = sequelize.define("ArchivoAdjunto", {
  id_archivo: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre_archivo: { type: DataTypes.STRING(250),  allowNull: true },
  estado: { type: DataTypes.STRING(20),  allowNull: true },
  fecha: { type: DataTypes.DATE,  allowNull: false },
  modulo: { type: DataTypes.STRING(100),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "archivo_adjunto", timestamps: false });

export default ArchivoAdjunto;