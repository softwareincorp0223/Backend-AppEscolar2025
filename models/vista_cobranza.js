import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaCobranza = sequelize.define(
  "VistaCobranza",
  {
    id_pago: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_alumno: {
      type: DataTypes.STRING(20),
    },

    modo: {
      type: DataTypes.STRING(50),
    },

    concepto: {
      type: DataTypes.STRING(150),
    },

    monto: {
      type: DataTypes.DECIMAL(10, 2),
    },

    sid_penalidad: {
      type: DataTypes.STRING(20),
    },

    status: {
      type: DataTypes.STRING(50),
    },

    fecha_pago: {
      type: DataTypes.DATE,
    },

    sid_usuario: {
      type: DataTypes.STRING(20),
    },

    sid_instituto: {
      type: DataTypes.STRING(20),
    },

    matricula: {
      type: DataTypes.STRING(50),
    },

    nombre_alumno: {
      type: DataTypes.STRING(150),
    },

    apellido_alumno: {
      type: DataTypes.STRING(150),
    },

    nombre_padre: {
      type: DataTypes.STRING(150),
    },

    apellido_padre: {
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: "vista_cobranza",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaCobranza;
