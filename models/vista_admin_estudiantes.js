import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaAdminEstudiantes = sequelize.define("VistaAdminEstudiantes", {
  id_alumno: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  id_padre: { type: DataTypes.STRING(20),  allowNull: true },
  nombre: { type: DataTypes.STRING(100),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true },
  id_asistencia: { type: DataTypes.STRING(20),  allowNull: true },
  id_evaluacion: { type: DataTypes.STRING(10),  allowNull: true },
  id_pago: { type: DataTypes.STRING(20),  allowNull: true },
  id_grado: { type: DataTypes.STRING(20),  allowNull: true },
  id_grupo: { type: DataTypes.STRING(20),  allowNull: true },
  receptor: { type: DataTypes.STRING(50),  allowNull: true },
  id_mensaje: { type: DataTypes.STRING(20),  allowNull: true },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true },
  id_seguimiento: { type: DataTypes.STRING(20),  allowNull: true },
  id_tareas: { type: DataTypes.STRING(20),  allowNull: true },
  sid_grado: { type: DataTypes.STRING(10),  allowNull: true },
  id_admin: { type: DataTypes.STRING(20),  allowNull: false },
  nombre: { type: DataTypes.STRING(100),  allowNull: true },
  apellido: { type: DataTypes.STRING(100),  allowNull: true },
  correo: { type: DataTypes.STRING(150),  allowNull: true },
  contrasena: { type: DataTypes.STRING(250),  allowNull: true },
  privilegios: { type: DataTypes.STRING(5),  allowNull: true }
}, { tableName: "vista_admin_estudiantes", timestamps: false });

export default VistaAdminEstudiantes;