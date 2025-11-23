import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Mensaje = sequelize.define("Mensaje", {
  id_mensaje: { type: DataTypes.STRING(20), primaryKey: true, allowNull: true },
  receptor: { type: DataTypes.STRING(50),  allowNull: true },
  sid_usuario_emisor: { type: DataTypes.STRING(5),  allowNull: false },
  sid_tipo: { type: DataTypes.STRING(20),  allowNull: true },
  sid_alumno: { type: DataTypes.STRING(20),  allowNull: false },
  sid_nivel: { type: DataTypes.STRING(20),  allowNull: false },
  sid_grado: { type: DataTypes.STRING(20),  allowNull: false },
  sid_grupo: { type: DataTypes.STRING(20),  allowNull: false },
  sid_extracurricular: { type: DataTypes.STRING(20),  allowNull: false },
  destinatarios: { type: DataTypes.STRING(100),  allowNull: true },
  asunto: { type: DataTypes.STRING(250),  allowNull: true },
  mensaje: { type: DataTypes.TEXT,  allowNull: true },
  respuesta_rapida: { type: DataTypes.STRING(5),  allowNull: true },
  mensaje_programado: { type: DataTypes.STRING(5),  allowNull: true },
  fecha_envio: { type: DataTypes.DATEONLY,  allowNull: true },
  hora_envio: { type: DataTypes.TIME,  allowNull: true },
  repetir: { type: DataTypes.STRING(5),  allowNull: true },
  periodo: { type: DataTypes.STRING(50),  allowNull: true },
  fecha_fin: { type: DataTypes.DATEONLY,  allowNull: true },
  leido: { type: DataTypes.STRING(10),  allowNull: false },
  eliminado: { type: DataTypes.STRING(20),  allowNull: false },
  sid_instituto: { type: DataTypes.STRING(20),  allowNull: true }
}, { tableName: "mensaje", timestamps: false });

export default Mensaje;