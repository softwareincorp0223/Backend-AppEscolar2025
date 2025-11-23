import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AsignarAtributo = sequelize.define("AsignarAtributo", {
  id_asignar_atributo: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_atributo: { type: DataTypes.STRING(20),  allowNull: true },
  sid_seguimiento: { type: DataTypes.STRING(20),  allowNull: true },
  valor_atributo: { type: DataTypes.STRING(150),  allowNull: true },
  fecha_registro: { type: DataTypes.DATEONLY,  allowNull: true },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "asignar_atributo", timestamps: false });

export default AsignarAtributo;