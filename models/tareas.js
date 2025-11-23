import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tareas = sequelize.define("Tareas", {
  id_tareas: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  sid_grupo: { type: DataTypes.STRING(20),  allowNull: true },
  sid_materia: { type: DataTypes.STRING(10),  allowNull: false },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true },
  instrucciones_tarea: { type: DataTypes.TEXT,  allowNull: false },
  fecha_creacion: { type: DataTypes.DATE,  allowNull: true }
}, { tableName: "tareas", timestamps: false });

export default Tareas;