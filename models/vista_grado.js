import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaGrado = sequelize.define(
  "VistaGrado",
  {
    id_grado: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    nombre_grado: {
      type: DataTypes.STRING(150),
    },

    nombre_nivel: {
      type: DataTypes.STRING(150),
    },

    sid_instituto: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: "vista_grado",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaGrado;
