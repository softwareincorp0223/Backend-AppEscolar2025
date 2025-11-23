import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Evento = sequelize.define("Evento", {
  id_evento: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(250),  allowNull: true },
  fecha: { type: DataTypes.DATEONLY,  allowNull: true },
  hora: { type: DataTypes.TIME,  allowNull: false },
  todos: { type: DataTypes.BOOLEAN,  allowNull: true },
  nivel: { type: DataTypes.STRING(20),  allowNull: true },
  grado: { type: DataTypes.STRING(20),  allowNull: true },
  grupo: { type: DataTypes.STRING(20),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "evento", timestamps: false });

export default Evento;