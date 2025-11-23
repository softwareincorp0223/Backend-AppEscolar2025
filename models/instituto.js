import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Instituto = sequelize.define("Instituto", {
  id_instituto: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(100),  allowNull: true },
  logo: { type: DataTypes.STRING(100),  allowNull: true },
  correo: { type: DataTypes.STRING(100),  allowNull: true },
  banco: { type: DataTypes.STRING(100),  allowNull: true },
  cuenta_banco: { type: DataTypes.STRING(20),  allowNull: true },
  descripcion: { type: DataTypes.TEXT,  allowNull: true },
  fecha_inicio_licencia: { type: DataTypes.DATEONLY,  allowNull: true },
  fecha_limite: { type: DataTypes.DATEONLY,  allowNull: true },
  politicas: { type: DataTypes.STRING(250),  allowNull: true },
  nombre_beneficiario: { type: DataTypes.STRING(100),  allowNull: true },
  asistencia: { type: DataTypes.BOOLEAN,  allowNull: true },
  pago: { type: DataTypes.BOOLEAN,  allowNull: true },
  fecha_creacion: { type: DataTypes.DATE,  allowNull: true },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "instituto", timestamps: false });

export default Instituto;