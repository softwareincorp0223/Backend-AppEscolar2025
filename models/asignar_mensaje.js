import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Alumno from "./Alumno.js";

const AsignarMensaje = sequelize.define(
  "AsignarMensaje",
  {
    id_asignar_mensaje: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },

    sid_alumno: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    sid_mensaje: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    respuesta_rapida: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    leido: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "asignar_mensaje",
    timestamps: false,
  }
);

AsignarMensaje.belongsTo(Alumno, {
  foreignKey: "sid_alumno",
  targetKey: "id_alumno",
});

Alumno.hasMany(AsignarMensaje, {
  foreignKey: "sid_alumno",
  sourceKey: "id_alumno",
});

export default AsignarMensaje;