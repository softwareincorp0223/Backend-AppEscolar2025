import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AsignarTutor = sequelize.define("AsignarTutor", {
  id_asignar_tutor: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_padre: { type: DataTypes.STRING(20),  allowNull: true },
  sid_alumno: { type: DataTypes.STRING(20),  allowNull: true },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "asignar_tutor", timestamps: false });

export default AsignarTutor;