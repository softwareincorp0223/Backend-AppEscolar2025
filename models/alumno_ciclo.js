import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./alumno.js";
import Ciclo from "./ciclo.js";
import Nivel from "./nivel.js";
import Grado from "./grado.js";
import Grupo from "./grupo.js";

const AlumnoCiclo = sequelize.define("AlumnoCiclo", {
  id_alumno_ciclo: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
  sid_alumno: { type: DataTypes.STRING(20), allowNull: false },
  sid_ciclo: { type: DataTypes.STRING(20), allowNull: false },
  sid_nivel: { type: DataTypes.STRING(20), allowNull: false },
  sid_grado: { type: DataTypes.STRING(20), allowNull: false },
  sid_grupo: { type: DataTypes.STRING(20), allowNull: false },
  estado: { type: DataTypes.STRING(30), allowNull: false, defaultValue: "activo" },
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
  fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
  promovido: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  observaciones: { type: DataTypes.STRING(255), allowNull: true },
  responsable: { type: DataTypes.STRING(20), allowNull: true },
  fecha_creacion: { type: DataTypes.DATE, allowNull: true },
  fecha_actualizacion: { type: DataTypes.DATE, allowNull: true },
}, { tableName: "alumno_ciclo", timestamps: false });

AlumnoCiclo.belongsTo(Alumno, { foreignKey: "sid_alumno", constraints: false });
AlumnoCiclo.belongsTo(Ciclo, { foreignKey: "sid_ciclo", constraints: false });
AlumnoCiclo.belongsTo(Nivel, { foreignKey: "sid_nivel", constraints: false });
AlumnoCiclo.belongsTo(Grado, { foreignKey: "sid_grado", constraints: false });
AlumnoCiclo.belongsTo(Grupo, { foreignKey: "sid_grupo", constraints: false });

Alumno.hasMany(AlumnoCiclo, { foreignKey: "sid_alumno", constraints: false });
Ciclo.hasMany(AlumnoCiclo, { foreignKey: "sid_ciclo", constraints: false });
Nivel.hasMany(AlumnoCiclo, { foreignKey: "sid_nivel", constraints: false });
Grado.hasMany(AlumnoCiclo, { foreignKey: "sid_grado", constraints: false });
Grupo.hasMany(AlumnoCiclo, { foreignKey: "sid_grupo", constraints: false });

export default AlumnoCiclo;
