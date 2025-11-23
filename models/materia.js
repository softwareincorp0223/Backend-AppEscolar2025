import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Instituto from "./instituto.js";


const Materia = sequelize.define("Materia", {
  id_materia: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_grado: { type: DataTypes.STRING(20),  allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: false },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "materia", timestamps: false });

Materia.belongsTo(Instituto, { foreignKey: "sid_instituto" });
export default Materia;