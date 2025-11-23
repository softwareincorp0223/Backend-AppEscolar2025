import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AsignarEvento = sequelize.define("AsignarEvento", {
  id_asignar_evento: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
  sid_evento: { type: DataTypes.STRING(20),  allowNull: false },
  sid_alumno: { type: DataTypes.STRING(20),  allowNull: false },
  leido: { type: DataTypes.STRING(20),  allowNull: false }
}, { tableName: "asignar_evento", timestamps: false });

export default AsignarEvento;