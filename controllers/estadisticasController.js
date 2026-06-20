// controllers/estadisticasController.js
import { Op, fn, col, literal } from "sequelize";
import Mensaje from "../models/mensaje.js";

export const getAll = async (req, res) => {
  try {
    const { sid_instituto } = req.query;

    const whereBase = {};

    if (sid_instituto) {
      whereBase.sid_instituto = sid_instituto;
    }

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const finMes = new Date();
    finMes.setMonth(finMes.getMonth() + 1);
    finMes.setDate(1);
    finMes.setHours(0, 0, 0, 0);

    const totalMensajesMes = await Mensaje.count({
      where: {
        ...whereBase,
        fecha_envio: {
          [Op.gte]: inicioMes,
          [Op.lt]: finMes,
        },
      },
    });

    const mensajesPorDia = await Mensaje.findAll({
      attributes: [
        [fn("DAY", col("fecha_envio")), "dia"],
        [fn("COUNT", col("id_mensaje")), "total"],
      ],
      where: {
        ...whereBase,
        fecha_envio: {
          [Op.gte]: inicioMes,
          [Op.lt]: finMes,
        },
      },
      group: [literal("DAY(fecha_envio)")],
      order: [[literal("DAY(fecha_envio)"), "ASC"]],
      raw: true,
    });

    return res.json({
      totalMensajesMes,
      mensajesPorDia,
    });
  } catch (error) {
    console.error("[estadisticas getAll]", error);

    return res.status(500).json({
      error: "Error al obtener estadísticas",
      details: error.message,
    });
  }
};

export const getById = async (req, res) => {
  return res.status(404).json({
    error: "Estadísticas no maneja consulta por ID",
  });
};

export const createOne = async (req, res) => {
  return res.status(405).json({
    error: "Estadísticas no permite crear registros",
  });
};

export const updateOne = async (req, res) => {
  return res.status(405).json({
    error: "Estadísticas no permite actualizar registros",
  });
};

export const deleteOne = async (req, res) => {
  return res.status(405).json({
    error: "Estadísticas no permite eliminar registros",
  });
};