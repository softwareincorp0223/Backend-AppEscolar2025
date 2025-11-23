import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./usuario.js";
import Materia from "./materia.js";
import Nivel from "./nivel.js";
import Grado from "./grado.js";


const AsignarMateria = sequelize.define("AsignarMateria", {
  id_asignar_materia: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false },
  sid_profesor: { type: DataTypes.STRING(20),  allowNull: false },
  sid_materia: { type: DataTypes.STRING(20),  allowNull: false },
  sid_nivel: { type: DataTypes.STRING(10),  allowNull: false },
  sid_grado: { type: DataTypes.STRING(10),  allowNull: false },
  sid_grupo: { type: DataTypes.STRING(20),  allowNull: false },
  sid_usuario: { type: DataTypes.STRING(20),  allowNull: false },
  fecha_creacion: { type: DataTypes.DATE,  allowNull: false }
}, { tableName: "asignar_materia", timestamps: false });

AsignarMateria.belongsTo(Usuario, { foreignKey: "sid_usuario" });
AsignarMateria.belongsTo(Materia, { foreignKey: "sid_materia" });
AsignarMateria.belongsTo(Nivel, { foreignKey: "sid_nivel" });
AsignarMateria.belongsTo(Grado, { foreignKey: "sid_grado" });

export default AsignarMateria;