import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Profesor = sequelize.define("Profesor", {
  id_profesor: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  apellido: { type: DataTypes.STRING(250),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(50),  allowNull: true }
}, { tableName: "profesor", timestamps: false });

export default Profesor;