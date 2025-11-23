import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Nivel from "./nivel.js"
import Grado from "./grado.js"
import Grupo from "./Grupo.js"

const Alumno = sequelize.define("Alumno", {
  id_alumno: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(250), allowNull: true },
  apellido: { type: DataTypes.STRING(250), allowNull: true },
  matricula: { type: DataTypes.STRING(100), allowNull: true },
  sexo: { type: DataTypes.STRING(20), allowNull: true },
  codigo_qr: { type: DataTypes.STRING(100), allowNull: false },
  sid_nivel: { type: DataTypes.STRING(20), allowNull: true },
  sid_grado: { type: DataTypes.STRING(20), allowNull: true },
  sid_grupo: { type: DataTypes.STRING(20), allowNull: true },
  sid_padre: { type: DataTypes.STRING(20), allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20), allowNull: true },
  foto: { type: DataTypes.STRING(255), allowNull: true },
  nombre_contacto: { type: DataTypes.STRING(50), allowNull: true },
  telefono_contacto: { type: DataTypes.STRING(20), allowNull: true },
  alergias: { type: DataTypes.STRING(100), allowNull: true }
}, { tableName: "alumno", timestamps: false });

// definir las relaciones
Alumno.belongsTo(Nivel, { foreignKey: "sid_nivel" });
Alumno.belongsTo(Grado, { foreignKey: "sid_grado" });
Alumno.belongsTo(Grupo, { foreignKey: "sid_grupo" });

Nivel.hasMany(Alumno, { foreignKey: "sid_nivel" });
Grado.hasMany(Alumno, { foreignKey: "sid_grado" });
Grupo.hasMany(Alumno, { foreignKey: "sid_grupo" });

export default Alumno;