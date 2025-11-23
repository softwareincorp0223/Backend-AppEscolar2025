import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Nivel from "./nivel.js"

const Grado = sequelize.define("Grado", {
  id_grado: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_nivel: { type: DataTypes.STRING(20),  allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  orden: { type: DataTypes.INTEGER,  allowNull: false }
}, { tableName: "grado", timestamps: false });

Grado.belongsTo(Nivel, { foreignKey: "sid_nivel" });

export default Grado;