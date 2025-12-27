import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const VistaGradoGrupo = sequelize.define(
  "VistaGradoGrupo",
  {
    id_grupo: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },

    sid_grado: {
      type: DataTypes.STRING(20),
    },

    nombre: {
      type: DataTypes.STRING(150),
    },

    sid_instituto: {
      type: DataTypes.STRING(20),
    },

    nombre_nivel: {
      type: DataTypes.STRING(150),
    },

    nombre_grado: {
      type: DataTypes.STRING(150),
    },
  },
  {
    tableName: "vista_grado_grupo",
    timestamps: false,
    freezeTableName: true,
  }
);

export default VistaGradoGrupo;
