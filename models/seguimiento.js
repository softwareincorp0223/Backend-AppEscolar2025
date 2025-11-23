import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";
import Usuario from "./usuario.js";

const Seguimiento = sequelize.define("Seguimiento", {
  id_seguimiento: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_alumno: { type: DataTypes.STRING(10),  allowNull: false },
  observacion: { type: DataTypes.STRING(350),  allowNull: false },
  fecha_registro: { type: DataTypes.DATEONLY,  allowNull: true },
  leido: { type: DataTypes.STRING(11),  allowNull: false },
  fecha_visto: { type: DataTypes.DATEONLY,  allowNull: true },
  responsable: { type: DataTypes.STRING(40),  allowNull: false },
  fecha_eliminacion: { type: DataTypes.DATEONLY,  allowNull: true },
  eliminado: { type: DataTypes.STRING(40),  allowNull: false },
  sid_usuario: { type: DataTypes.STRING(10),  allowNull: false }
}, { tableName: "seguimiento", timestamps: false });

Seguimiento.belongsTo(Alumno, { foreignKey: "sid_alumno" });
Seguimiento.belongsTo(Usuario, { foreignKey: "sid_usuario" });

export default Seguimiento;