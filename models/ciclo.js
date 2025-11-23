import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Instituto from "./instituto.js";

const Ciclo = sequelize.define("Ciclo", {
  id_ciclo: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(20),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true },
  ciclo_cerrado: { type: DataTypes.INTEGER,  allowNull: true },
  orden: { type: DataTypes.INTEGER,  allowNull: true }
}, { tableName: "ciclo", timestamps: false });

Ciclo.belongsTo(Instituto, { foreignKey: "sid_instituto" });

export default Ciclo;