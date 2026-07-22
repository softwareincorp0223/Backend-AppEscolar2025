import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";

const AsignarTarea = sequelize.define("AsignarTarea", {
  id_asignar_tarea: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
  sid_tarea: { type: DataTypes.STRING(20),  allowNull: false },
  sid_alumno: { type: DataTypes.STRING(20),  allowNull: false },
  estatus: { type: DataTypes.STRING(30),  allowNull: false },
  observacion: { type: DataTypes.STRING(200),  allowNull: true },
  leido: { type: DataTypes.STRING(10),  allowNull: true }
}, { tableName: "asignar_tarea", timestamps: false });

AsignarTarea.belongsTo(Alumno, { foreignKey: "sid_alumno" });
Alumno.hasMany(AsignarTarea, { foreignKey: "sid_alumno" });

export default AsignarTarea;
