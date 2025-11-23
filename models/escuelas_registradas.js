import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EscuelasRegistradas = sequelize.define("EscuelasRegistradas", {
  escuelas_registradas_id: { type: DataTypes.STRING(10), primaryKey: true, allowNull: false },
  nombre_contacto: { type: DataTypes.STRING(50),  allowNull: false },
  telefono_contacto: { type: DataTypes.STRING(12),  allowNull: false },
  relacion_escuela: { type: DataTypes.STRING(70),  allowNull: false },
  correo_contacto: { type: DataTypes.STRING(100),  allowNull: false },
  nombre_clave: { type: DataTypes.STRING(100),  allowNull: false },
  entidad: { type: DataTypes.STRING(100),  allowNull: false },
  municipio: { type: DataTypes.STRING(100),  allowNull: false },
  localidad: { type: DataTypes.STRING(100),  allowNull: false },
  nivel_educativo: { type: DataTypes.STRING(50),  allowNull: false },
  turno: { type: DataTypes.STRING(50),  allowNull: false },
  sostenimiento: { type: DataTypes.STRING(50),  allowNull: false },
  fecha_registro_contacto: { type: DataTypes.DATE,  allowNull: false }
}, { tableName: "escuelas_registradas", timestamps: false });

export default EscuelasRegistradas;