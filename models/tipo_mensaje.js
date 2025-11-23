import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Instituto from "./instituto.js";

const TipoMensaje = sequelize.define("TipoMensaje", {
  id_tipo_mensaje: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  icono: { type: DataTypes.STRING(250),  allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "tipo_mensaje", timestamps: false });

TipoMensaje.belongsTo(Instituto, { foreignKey: "sid_instituto" });

export default TipoMensaje;