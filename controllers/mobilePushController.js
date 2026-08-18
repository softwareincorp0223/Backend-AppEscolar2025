import { Op } from "sequelize";

import Alumno from "../models/alumno.js";
import AsignarAtributo from "../models/asignar_atributo.js";
import AsignarTarea from "../models/asignar_tarea.js";
import Evento from "../models/evento.js";
import Mensaje from "../models/mensaje.js";
import Seguimiento from "../models/seguimiento.js";
import Tareas from "../models/tareas.js";
import TipoMensaje from "../models/tipo_mensaje.js";
import {
  getDispositivosByPadres,
  getPadresByAlumnos,
  sendPushToAlumnos,
  sendPushToDispositivos,
} from "../services/pushNotificationService.js";

const ACTIVE_VALUES = ["si", "SI", "Si", "sí", "Sí", "1", 1, true, "true"];

const isActiveValue = (value) => ACTIVE_VALUES.includes(value);

const toPlain = (row) => (row?.toJSON ? row.toJSON() : row);

const cleanText = (value = "") => {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeAlumnoIds = (value) => {
  const ids = Array.isArray(value) ? value : [value];

  return [
    ...new Set(
      ids
        .map((id) => (typeof id === "string" ? id.trim() : String(id || "")))
        .filter(Boolean),
    ),
  ];
};

const normalizeIds = (value) => normalizeAlumnoIds(value);

const onlyValidValues = (filters) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "" && value !== "0";
    })
  );
};

const getSidAlumnosByFilters = async ({
  sid_instituto,
  sid_nivel,
  sid_grado,
  sid_grupo,
}) => {
  const alumnos = await Alumno.findAll({
    where: onlyValidValues({
      sid_instituto,
      sid_nivel,
      sid_grado,
      sid_grupo,
    }),
    attributes: ["id_alumno"],
  });

  return alumnos.map((alumno) => alumno.id_alumno).filter(Boolean);
};

const sendModulePushToAlumnos = async ({
  sidAlumnos = [],
  title,
  body,
  tipoModulo,
  sidReferencia,
  data = {},
}) => {
  return sendPushToAlumnos({
    sidAlumnos,
    title,
    body,
    tipoModulo,
    sidReferencia,
    data: {
      modulo: tipoModulo,
      tipo_modulo: tipoModulo,
      sid_referencia: sidReferencia,
      ...data,
    },
  });
};

export const enviarPushMensajeInmediato = async (req, res) => {
  try {
    const { id } = req.params;
    const sidAlumnos = normalizeAlumnoIds(req.body?.sid_alumnos);

    if (!id) {
      return res.status(400).json({
        status: "error",
        msg: "id_mensaje requerido",
      });
    }

    if (!sidAlumnos.length) {
      return res.status(400).json({
        status: "error",
        msg: "sid_alumnos requerido",
      });
    }

    const mensajeRow = await Mensaje.findByPk(id);

    if (!mensajeRow) {
      return res.status(404).json({
        status: "error",
        msg: "Mensaje no encontrado",
      });
    }

    const mensaje = toPlain(mensajeRow);

    if (isActiveValue(mensaje.mensaje_programado)) {
      return res.json({
        status: "ok",
        skipped: true,
        reason: "mensaje_programado",
        msg: "Mensaje programado omitido para envio inmediato",
      });
    }

    const idPadres = await getPadresByAlumnos(sidAlumnos);
    const dispositivos = await getDispositivosByPadres(idPadres);
    const tokens = [
      ...new Set(
        dispositivos
          .map((dispositivo) => dispositivo.token_dispositivo)
          .filter(Boolean),
      ),
    ];

    if (!idPadres.length || !tokens.length) {
      return res.json({
        status: "ok",
        sent: 0,
        padres: idPadres.length,
        dispositivos: dispositivos.length,
        tokens: tokens.length,
        msg: "No hay padres o tokens registrados para este mensaje",
      });
    }

    const tipoMensaje = mensaje.sid_tipo
      ? await TipoMensaje.findByPk(mensaje.sid_tipo)
      : null;
    const tipoNombre = toPlain(tipoMensaje)?.nombre || "Mensaje";
    const asunto = cleanText(mensaje.asunto) || tipoNombre;
    const body = cleanText(mensaje.mensaje) || "Tienes un nuevo mensaje escolar.";

    const result = await sendPushToDispositivos({
      dispositivos,
      title: asunto,
      body,
      tipoModulo: "mensajes",
      sidReferencia: mensaje.id_mensaje,
      data: {
        modulo: "mensajes",
        tipo_modulo: "mensajes",
        sid_referencia: mensaje.id_mensaje,
        id_mensaje: mensaje.id_mensaje,
      },
    });

    return res.json({
      status: "ok",
      sent: result.sent,
      padres: idPadres.length,
      dispositivos: dispositivos.length,
      tokens: tokens.length,
      tickets: result.tickets,
      errors: result.errors,
    });
  } catch (error) {
    console.error("[mobile enviarPushMensajeInmediato]", error);

    return res.status(500).json({
      status: "error",
      msg: "Error al enviar notificacion del mensaje",
      details: error.message,
    });
  }
};

export const enviarPushTarea = async (req, res) => {
  try {
    const { id } = req.params;
    let sidAlumnos = normalizeAlumnoIds(req.body?.sid_alumnos);

    if (!id) {
      return res.status(400).json({ status: "error", msg: "id_tarea requerido" });
    }

    const tareaRow = await Tareas.findByPk(id);
    if (!tareaRow) {
      return res.status(404).json({ status: "error", msg: "Tarea no encontrada" });
    }

    if (!sidAlumnos.length) {
      const asignaciones = await AsignarTarea.findAll({
        where: { sid_tarea: id },
        attributes: ["sid_alumno"],
      });
      sidAlumnos = asignaciones.map((asignacion) => asignacion.sid_alumno);
    }

    if (!sidAlumnos.length) {
      return res.json({ status: "ok", sent: 0, msg: "No hay alumnos asignados" });
    }

    const tarea = toPlain(tareaRow);
    const result = await sendModulePushToAlumnos({
      sidAlumnos,
      title: "Nueva tarea",
      body: cleanText(tarea.instrucciones_tarea) || "Tienes una nueva tarea escolar.",
      tipoModulo: "tareas",
      sidReferencia: id,
      data: { id_tarea: id },
    });

    return res.json({
      status: "ok",
      sent: result.sent,
      dispositivos: result.dispositivos,
      tokens: result.tokens,
      tickets: result.tickets,
      errors: result.errors,
    });
  } catch (error) {
    console.error("[mobile enviarPushTarea]", error);

    return res.status(500).json({
      status: "error",
      msg: "Error al enviar notificacion de tarea",
      details: error.message,
    });
  }
};

export const enviarPushSeguimiento = async (req, res) => {
  try {
    const { id } = req.params;
    let sidAlumnos = normalizeAlumnoIds(req.body?.sid_alumnos);

    if (!id) {
      return res
        .status(400)
        .json({ status: "error", msg: "id_seguimiento requerido" });
    }

    const seguimientoRow = await Seguimiento.findByPk(id);
    if (!seguimientoRow) {
      return res
        .status(404)
        .json({ status: "error", msg: "Seguimiento no encontrado" });
    }

    const seguimiento = toPlain(seguimientoRow);
    if (!sidAlumnos.length && seguimiento.sid_alumno) {
      sidAlumnos = [seguimiento.sid_alumno];
    }

    if (!sidAlumnos.length) {
      return res.json({ status: "ok", sent: 0, msg: "No hay alumno asociado" });
    }

    const result = await sendModulePushToAlumnos({
      sidAlumnos,
      title: "Nuevo seguimiento",
      body: "Nuevo seguimiento agregado",
      tipoModulo: "seguimientos",
      sidReferencia: id,
      data: { id_seguimiento: id },
    });

    return res.json({
      status: "ok",
      sent: result.sent,
      dispositivos: result.dispositivos,
      tokens: result.tokens,
      tickets: result.tickets,
      errors: result.errors,
    });
  } catch (error) {
    console.error("[mobile enviarPushSeguimiento]", error);

    return res.status(500).json({
      status: "error",
      msg: "Error al enviar notificacion de seguimiento",
      details: error.message,
    });
  }
};

export const enviarPushSeguimientosImport = async (req, res) => {
  try {
    const idsAsignarAtributo = normalizeIds(req.body?.ids_asignar_atributo);
    let sidAlumnos = normalizeAlumnoIds(req.body?.sid_alumnos);

    if (!sidAlumnos.length && idsAsignarAtributo.length) {
      const atributos = await AsignarAtributo.findAll({
        where: {
          id_asignar_atributo: {
            [Op.in]: idsAsignarAtributo,
          },
        },
        include: [{ model: Seguimiento, attributes: ["sid_alumno"] }],
      });

      sidAlumnos = atributos
        .map((atributo) => toPlain(atributo)?.Seguimiento?.sid_alumno)
        .filter(Boolean);
    }

    if (!sidAlumnos.length && req.body?.sid_instituto) {
      sidAlumnos = await getSidAlumnosByFilters({
        sid_instituto: req.body.sid_instituto,
        sid_nivel: req.body.sid_nivel,
        sid_grado: req.body.sid_grado,
        sid_grupo: normalizeIds(req.body.sid_grupos)[0],
      });
    }

    if (!sidAlumnos.length) {
      return res.json({ status: "ok", sent: 0, msg: "No hay alumnos para notificar" });
    }

    const sidReferencia =
      req.body?.import_id || idsAsignarAtributo[0] || sidAlumnos[0] || "importacion";
    const result = await sendModulePushToAlumnos({
      sidAlumnos,
      title: "Nuevos seguimientos",
      body: "Se registraron nuevos seguimientos academicos.",
      tipoModulo: "seguimientos",
      sidReferencia,
      data: { import_id: req.body?.import_id || null },
    });

    return res.json({
      status: "ok",
      sent: result.sent,
      dispositivos: result.dispositivos,
      tokens: result.tokens,
      tickets: result.tickets,
      errors: result.errors,
    });
  } catch (error) {
    console.error("[mobile enviarPushSeguimientosImport]", error);

    return res.status(500).json({
      status: "error",
      msg: "Error al enviar notificaciones de seguimientos",
      details: error.message,
    });
  }
};

export const enviarPushCalificacionesImport = async (req, res) => {
  try {
    let sidAlumnos = normalizeAlumnoIds(req.body?.sid_alumnos);

    if (!sidAlumnos.length) {
      sidAlumnos = await getSidAlumnosByFilters({
        sid_instituto: req.body?.sid_instituto,
        sid_nivel: req.body?.sid_nivel,
        sid_grado: req.body?.sid_grado,
        sid_grupo: req.body?.sid_grupo,
      });
    }

    if (!sidAlumnos.length) {
      return res.json({ status: "ok", sent: 0, msg: "No hay alumnos para notificar" });
    }

    const sidReferencia =
      req.body?.import_id || req.body?.sid_grupo || req.body?.sid_instituto || "importacion";
    const result = await sendModulePushToAlumnos({
      sidAlumnos,
      title: "Nuevas calificaciones",
      body: "Ya puedes consultar nuevas calificaciones.",
      tipoModulo: "calificaciones",
      sidReferencia,
      data: { import_id: req.body?.import_id || null },
    });

    return res.json({
      status: "ok",
      sent: result.sent,
      dispositivos: result.dispositivos,
      tokens: result.tokens,
      tickets: result.tickets,
      errors: result.errors,
    });
  } catch (error) {
    console.error("[mobile enviarPushCalificacionesImport]", error);

    return res.status(500).json({
      status: "error",
      msg: "Error al enviar notificaciones de calificaciones",
      details: error.message,
    });
  }
};

export const enviarPushEvento = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: "error", msg: "id_evento requerido" });
    }

    const eventoRow = await Evento.findByPk(id);
    if (!eventoRow) {
      return res.status(404).json({ status: "error", msg: "Evento no encontrado" });
    }

    const evento = toPlain(eventoRow);
    const sidAlumnos = await getSidAlumnosByFilters({
      sid_instituto: evento.sid_instituto,
      sid_nivel: isActiveValue(evento.todos) ? null : evento.nivel,
      sid_grado: isActiveValue(evento.todos) ? null : evento.grado,
      sid_grupo: isActiveValue(evento.todos) ? null : evento.grupo,
    });

    if (!sidAlumnos.length) {
      return res.json({ status: "ok", sent: 0, msg: "No hay alumnos para notificar" });
    }

    const fecha = [evento.fecha, evento.hora].filter(Boolean).join(" ");
    const result = await sendModulePushToAlumnos({
      sidAlumnos,
      title: cleanText(evento.nombre) || "Nuevo evento",
      body: fecha ? `Evento programado: ${fecha}` : "Hay un nuevo evento escolar.",
      tipoModulo: "calendario",
      sidReferencia: id,
      data: { id_evento: id },
    });

    return res.json({
      status: "ok",
      sent: result.sent,
      dispositivos: result.dispositivos,
      tokens: result.tokens,
      tickets: result.tickets,
      errors: result.errors,
    });
  } catch (error) {
    console.error("[mobile enviarPushEvento]", error);

    return res.status(500).json({
      status: "error",
      msg: "Error al enviar notificacion de calendario",
      details: error.message,
    });
  }
};
