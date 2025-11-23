import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Instituto from "./instituto.js";


const Nivel = sequelize.define("Nivel", {
  id_nivel: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: false },
  orden: { type: DataTypes.INTEGER,  allowNull: false }
}, { tableName: "nivel", timestamps: false });

Nivel.belongsTo(Instituto, { foreignKey: "sid_instituto" });

export default Nivel;