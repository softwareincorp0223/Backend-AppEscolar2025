import { Op, fn, col, literal } from "sequelize";
import Mensaje from "../models/mensaje.js";
import Evento from "../models/evento.js";
import Tareas from "../models/tareas.js";
import Alumno from "../models/alumno.js";
import AsignarMateria from "../models/asignar_materia.js";
import Usuario from "../models/usuario.js";
import Padre from "../models/padre.js";
import Nivel from "../models/nivel.js";
import Grado from "../models/grado.js";
import Grupo from "../models/grupo.js";

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const toDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getInicioMes = (baseDate = new Date()) => {
  const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getFinMes = (baseDate = new Date()) => {
  const date = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const normalizeDateKey = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return toDateOnly(new Date(value));
};

const buildWeeklySeries = (rows, today) => {
  const start = addDays(startOfDay(today), -6);
  const totals = new Map(
    rows.map((row) => [normalizeDateKey(row.fecha), Number(row.total) || 0]),
  );

  return Array.from({ length: 7 }, (_, index) => {
    const currentDate = addDays(start, index);
    const key = toDateOnly(currentDate);

    return {
      fecha: key,
      label: DAY_NAMES[currentDate.getDay()],
      total: totals.get(key) || 0,
    };
  });
};

const getMensajePreview = (mensaje) => {
  if (mensaje.asunto?.trim()) return mensaje.asunto.trim();
  if (mensaje.mensaje?.trim()) {
    return mensaje.mensaje.replace(/<[^>]+>/g, "").slice(0, 80).trim();
  }
  return "Mensaje sin asunto";
};

const getTareaPreview = (tarea) => {
  if (!tarea.instrucciones_tarea) return "Nueva tarea publicada";

  return tarea.instrucciones_tarea
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
};

const getEventoScope = (evento) => {
  if (evento.todos) return "Toda la escuela";

  const parts = [];
  if (evento.nivel) parts.push("nivel");
  if (evento.grado) parts.push("grado");
  if (evento.grupo) parts.push("grupo");

  return parts.length > 0
    ? `Segmentado por ${parts.join(" / ")}`
    : "Evento programado";
};

const getActivityDate = (item) => {
  if (!item.fecha) return 0;
  const composedDate = item.hora ? `${item.fecha}T${item.hora}` : item.fecha;
  return new Date(composedDate).getTime();
};

export const getAll = async (req, res) => {
  try {
    const { sid_instituto } = req.query;

    const whereBase = {};
    if (sid_instituto) {
      whereBase.sid_instituto = sid_instituto;
    }

    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const inicioMes = getInicioMes(today);
    const finMes = getFinMes(today);
    const inicioMesAnterior = getInicioMes(addDays(inicioMes, -1));
    const inicioSemana = addDays(today, -6);

    const [
      totalMensajesMes,
      totalMensajesMesAnterior,
      totalProfesores,
      totalPadres,
      totalUsuarios,
      totalAlumnos,
      totalNiveles,
      totalGrados,
      totalGrupos,
      totalTareasMes,
      totalTareasSemana,
      totalEventosHoy,
      mensajesPorDiaRows,
      actividadSemanalRows,
      alumnosPorNivelRows,
      eventosProximos,
      mensajesRecientes,
      tareasRecientes,
    ] = await Promise.all([
      Mensaje.count({
        where: {
          ...whereBase,
          fecha_envio: {
            [Op.gte]: inicioMes,
            [Op.lt]: finMes,
          },
        },
      }),
      Mensaje.count({
        where: {
          ...whereBase,
          fecha_envio: {
            [Op.gte]: inicioMesAnterior,
            [Op.lt]: inicioMes,
          },
        },
      }),
      AsignarMateria.count({
        distinct: true,
        col: "sid_usuario",
        ...(sid_instituto
          ? {
              include: [
                {
                  model: Usuario,
                  attributes: [],
                  where: { sid_instituto },
                  required: true,
                },
              ],
            }
          : {}),
      }),
      Padre.count({ where: whereBase }),
      Usuario.count({ where: whereBase }),
      Alumno.count({ where: whereBase }),
      Nivel.count({ where: whereBase }),
      Grado.count({
        include: [
          {
            model: Nivel,
            attributes: [],
            where: whereBase,
            required: true,
          },
        ],
      }),
      Grupo.count({
        include: [
          {
            model: Grado,
            attributes: [],
            required: true,
            include: [
              {
                model: Nivel,
                attributes: [],
                where: whereBase,
                required: true,
              },
            ],
          },
        ],
      }),
      Tareas.count({
        where: {
          ...whereBase,
          fecha_creacion: {
            [Op.gte]: inicioMes,
            [Op.lt]: finMes,
          },
        },
      }),
      Tareas.count({
        where: {
          ...whereBase,
          fecha_creacion: {
            [Op.gte]: inicioSemana,
            [Op.lt]: tomorrow,
          },
        },
      }),
      Evento.count({
        where: {
          ...whereBase,
          fecha: toDateOnly(today),
        },
      }),
      Mensaje.findAll({
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
      }),
      Mensaje.findAll({
        attributes: [
          [fn("DATE", col("fecha_envio")), "fecha"],
          [fn("COUNT", col("id_mensaje")), "total"],
        ],
        where: {
          ...whereBase,
          fecha_envio: {
            [Op.gte]: inicioSemana,
            [Op.lt]: tomorrow,
          },
        },
        group: [literal("DATE(fecha_envio)")],
        order: [[literal("DATE(fecha_envio)"), "ASC"]],
        raw: true,
      }),
      Alumno.findAll({
        attributes: [
          [col("Nivel.nombre"), "nivel"],
          [fn("COUNT", col("Alumno.id_alumno")), "total"],
        ],
        where: whereBase,
        include: [
          {
            model: Nivel,
            attributes: [],
            required: false,
          },
        ],
        group: [col("Nivel.nombre")],
        order: [[literal("COUNT(Alumno.id_alumno)"), "DESC"]],
        raw: true,
      }),
      Evento.findAll({
        attributes: [
          "id_evento",
          "nombre",
          "fecha",
          "hora",
          "todos",
          "nivel",
          "grado",
          "grupo",
        ],
        where: {
          ...whereBase,
          fecha: {
            [Op.gte]: toDateOnly(today),
          },
        },
        order: [
          ["fecha", "ASC"],
          ["hora", "ASC"],
        ],
        limit: 3,
        raw: true,
      }),
      Mensaje.findAll({
        attributes: ["id_mensaje", "asunto", "mensaje", "fecha_envio"],
        where: whereBase,
        order: [["fecha_envio", "DESC"]],
        limit: 4,
        raw: true,
      }),
      Tareas.findAll({
        attributes: ["id_tareas", "instrucciones_tarea", "fecha_creacion"],
        where: whereBase,
        order: [["fecha_creacion", "DESC"]],
        limit: 4,
        raw: true,
      }),
    ]);

    const mensajesPorDia = mensajesPorDiaRows.map((row) => ({
      dia: Number(row.dia) || 0,
      total: Number(row.total) || 0,
    }));

    const actividadSemanal = buildWeeklySeries(actividadSemanalRows, today);
    const alumnosPorNivel = alumnosPorNivelRows.map((row) => ({
      nivel: row.nivel || "Sin nivel",
      total: Number(row.total) || 0,
    }));

    const variacionMensajesMes =
      totalMensajesMesAnterior > 0
        ? Number(
          (
            ((totalMensajesMes - totalMensajesMesAnterior) /
              totalMensajesMesAnterior) *
            100
          ).toFixed(1),
        )
        : totalMensajesMes > 0
          ? 100
          : 0;

    const actividadBase = [
      ...mensajesRecientes.map((mensaje) => ({
        tipo: "mensaje",
        icono: "mail",
        color: "primary",
        titulo: "Nuevo mensaje enviado",
        texto: getMensajePreview(mensaje),
        fecha: normalizeDateKey(mensaje.fecha_envio),
      })),
      ...tareasRecientes.map((tarea) => ({
        tipo: "tarea",
        icono: "assignment",
        color: "warning",
        titulo: "Nueva tarea publicada",
        texto: getTareaPreview(tarea),
        fecha: tarea.fecha_creacion,
      })),
    ]
      .sort((a, b) => getActivityDate(b) - getActivityDate(a))
      .slice(0, 6);

    const actividadReciente =
      actividadBase.length > 0
        ? actividadBase
        : eventosProximos.map((evento) => ({
          tipo: "evento",
          icono: "event",
          color: "success",
          titulo: "Evento programado",
          texto: evento.nombre || "Evento sin nombre",
          fecha: evento.fecha,
          hora: evento.hora,
        }));

    return res.json({
      totalMensajesMes,
      totalProfesores,
      totalPadres,
      totalUsuarios,
      totalAlumnos,
      totalNiveles,
      totalGrados,
      totalGrupos,
      totalTareasMes,
      totalTareasSemana,
      totalEventosProximos: eventosProximos.length,
      totalEventosHoy,
      variacionMensajesMes,
      mensajesPorDia,
      actividadSemanal,
      alumnosPorNivel,
      eventosProximos: eventosProximos.map((evento) => ({
        id_evento: evento.id_evento,
        nombre: evento.nombre || "Evento sin nombre",
        fecha: normalizeDateKey(evento.fecha),
        hora: evento.hora,
        alcance: getEventoScope(evento),
      })),
      actividadReciente,
    });
  } catch (error) {
    console.error("[estadisticas getAll]", error);

    return res.status(500).json({
      error: "Error al obtener estadisticas",
      details: error.message,
    });
  }
};

export const getById = async (req, res) => {
  return res.status(404).json({
    error: "Estadisticas no maneja consulta por ID",
  });
};

export const createOne = async (req, res) => {
  return res.status(405).json({
    error: "Estadisticas no permite crear registros",
  });
};

export const updateOne = async (req, res) => {
  return res.status(405).json({
    error: "Estadisticas no permite actualizar registros",
  });
};

export const deleteOne = async (req, res) => {
  return res.status(405).json({
    error: "Estadisticas no permite eliminar registros",
  });
};
