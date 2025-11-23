import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Rol from "./rol.js";
import Instituto from "./instituto.js";

const Usuario = sequelize.define("Usuario", {
  id_usuario: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  nombre: { type: DataTypes.STRING(100),  allowNull: true },
  apellido: { type: DataTypes.STRING(100),  allowNull: true },
  correo: { type: DataTypes.STRING(100),  allowNull: true },
  sid_rol: { type: DataTypes.STRING(20),  allowNull: true },
  contrasena: { type: DataTypes.STRING(250),  allowNull: true },
  creacion: { type: DataTypes.DATE,  allowNull: false },
  modificacion: { type: DataTypes.DATE,  allowNull: false },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: false }
}, { tableName: "usuario", timestamps: false });

// definir las relaciones
Usuario.belongsTo(Rol, { foreignKey: "sid_rol" });
Usuario.belongsTo(Instituto, { foreignKey: "sid_instituto" });

export default Usuario;