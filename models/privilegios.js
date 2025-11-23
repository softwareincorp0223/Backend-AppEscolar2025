import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Privilegios = sequelize.define("Privilegios", {
  privilegios_id: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  nombre_privilegio: { type: DataTypes.STRING(50),  allowNull: false }
}, { tableName: "privilegios", timestamps: false });

export default Privilegios;