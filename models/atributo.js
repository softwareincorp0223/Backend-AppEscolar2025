import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Instituto from "./instituto.js";
import Usuario from "./usuario.js";


const Atributo = sequelize.define("Atributo", {
  id_atributo: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  icono: { type: DataTypes.STRING(250),  allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: false }
}, { tableName: "atributo", timestamps: false });

Atributo.belongsTo(Instituto, { foreignKey: "sid_instituto" });
Atributo.belongsTo(Usuario, { foreignKey: "sid_usuario" });


export default Atributo;