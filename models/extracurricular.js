import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Instituto from "./instituto.js";


const Extracurricular = sequelize.define("Extracurricular", {
  id_extracurricular: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "extracurricular", timestamps: false });

Extracurricular.belongsTo(Instituto, { foreignKey: "sid_instituto" });

export default Extracurricular;