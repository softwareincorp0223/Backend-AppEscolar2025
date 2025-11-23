import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Pago = sequelize.define("Pago", {
  id_pago: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_alumno: { type: DataTypes.STRING(20),  allowNull: true },
  modo: { type: DataTypes.STRING(50),  allowNull: true },
  concepto: { type: DataTypes.STRING(100),  allowNull: true },
  monto: { type: DataTypes.DECIMAL,  allowNull: true },
  sid_penalidad: { type: DataTypes.STRING(20),  allowNull: true },
  status: { type: DataTypes.BOOLEAN,  allowNull: true },
  fecha_pago: { type: DataTypes.DATEONLY,  allowNull: true },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "pago", timestamps: false });

export default Pago;