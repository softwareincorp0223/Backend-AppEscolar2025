import ImageKit from "imagekit";
import { Op } from "sequelize";

import Alumno from "../models/alumno.js";
import Padre from "../models/padre.js";
import AsignarTutor from "../models/asignar_tutor.js";
import AsignarMensaje from "../models/asignar_mensaje.js";
import Mensaje from "../models/mensaje.js";
import TipoMensaje from "../models/tipo_mensaje.js";
import ArchivoMensaje from "../models/archivo_mensaje.js";
import UrlMensaje from "../models/url_mensaje.js";
import AsignarTarea from "../models/asignar_tarea.js";
import Tareas from "../models/tareas.js";
import ArchivoTarea from "../models/archivo_tarea.js";
import ArchivoRespuestaTarea from "../models/archivo_respuesta_tarea.js";
import UrlTarea from "../models/url_tarea.js";
import Seguimiento from "../models/seguimiento.js";
import AsignarAtributo from "../models/asignar_atributo.js";
import Atributo from "../models/atributo.js";
import VistaCalificaciones from "../models/vista_calificaciones.js";
import Evaluacion from "../models/evaluacion.js";
import VistaAsistencia from "../models/vista_asistencia.js";
import Asistencia from "../models/asistencia.js";
import Evento from "../models/evento.js";
import AsignarEvento from "../models/asignar_evento.js";
import Instituto from "../models/instituto.js";
import DispositivosPadre from "../models/dispositivos_padre.js";
import { generadorID } from "../helpers/generadorID.js";

const READ_VALUES = ["si", "SI", "Si", "1", 1, true, "true", "visto", "Visto"];
const UNREAD_VALUES = ["no", "NO", "No", "0", 0, false, "false", null, ""];
const ACTIVE_VALUES = ["si", "SI", "Si", "sí", "Sí", "1", 1, true, "true"];

const isReadValue = (value) => READ_VALUES.includes(value);
const isActiveValue = (value) => ACTIVE_VALUES.includes(value);
const normalizeSiNo = (value) => (isActiveValue(value) ? "si" : "no");

const toPlain = (row) => (row?.toJSON ? row.toJSON() : row);

const ok = (res, data) => res.json(data);

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const getPagination = (req, fallbackLimit) => {
  const limit = Math.max(1, Number(req.query.limit) || fallbackLimit);
  const offset = Math.max(0, Number(req.query.offset) || 0);

  return { limit, offset };
};

const pageResult = (items, limit, offset) => ({
  items: items.slice(0, limit),
  pagination: {
    limit,
    offset,
    hasMore: items.length > limit,
  },
});

const formatDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTemporalContext = async () => {
  // CONSULTA TEMPORAL PARA CAMBIAR DESPUES:
  // Aqui se toma una institucion random y un padre random de esa institucion.
  // Cuando conectes login QR, reemplaza esta funcion por el padre autenticado.
  const instituto = await Instituto.findOne({ order: [["id_instituto", "ASC"]] });
  if (!instituto) return { instituto: null, padre: null };

  const padre = await Padre.findOne({
    where: { sid_instituto: instituto.id_instituto },
    order: [["id_padre", "ASC"]],
  });

  return { instituto: toPlain(instituto), padre: toPlain(padre) };
};

const getRequestValue = (req, key) => {
  return req.query?.[key] || req.body?.[key] || req.headers?.[key.replace("_", "-")];
};

const getPadreId = (req) => {
  const idPadre = getRequestValue(req, "id_padre");
  return typeof idPadre === "string" && idPadre.trim() ? idPadre.trim() : null;
};

const getContextByPadre = async (idPadre) => {
  if (!idPadre) return { instituto: null, padre: null };

  const padre = await Padre.findByPk(idPadre);
  if (!padre) return { instituto: null, padre: null };

  const padrePlain = toPlain(padre);
  const instituto = padrePlain.sid_instituto
    ? await Instituto.findByPk(padrePlain.sid_instituto)
    : null;

  return { instituto: toPlain(instituto), padre: padrePlain };
};

const getAlumnoIdsByPadre = async (idPadre) => {
  const directos = await Alumno.findAll({
    where: { sid_padre: idPadre },
    attributes: ["id_alumno"],
  });

  const asignados = await AsignarTutor.findAll({
    where: { sid_padre: idPadre },
    attributes: ["sid_alumno"],
  });

  return [
    ...new Set([
      ...directos.map((row) => row.id_alumno),
      ...asignados.map((row) => row.sid_alumno),
    ]),
  ].filter(Boolean);
};

const countUnread = async (Model, where) => {
  return Model.count({
    where: {
      ...where,
      leido: { [Op.or]: UNREAD_VALUES },
    },
  });
};

const getSelectedAlumnoId = async (req) => {
  if (req.query.sid_alumno) return req.query.sid_alumno;
  if (req.body?.sid_alumno) return req.body.sid_alumno;

  const idPadre = getPadreId(req);
  if (!idPadre) return null;

  const alumnoIds = await getAlumnoIdsByPadre(idPadre);
  return alumnoIds[0] || null;
};

const getNotificationsByAlumno = async (sidAlumno) => {
  if (!sidAlumno) {
    return {
      Mensajes: false,
      Tareas: false,
      Seguimientos: false,
      Calificaciones: false,
      Calendario: false,
      Asistencias: false,
      Perfil: false,
      Configuracion: false,
    };
  }

  const [
    mensajes,
    tareas,
    seguimientos,
    calificaciones,
    calendario,
    asistencias,
  ] = await Promise.all([
    countUnread(AsignarMensaje, { sid_alumno: sidAlumno }),
    countUnread(AsignarTarea, { sid_alumno: sidAlumno }),
    countUnread(Seguimiento, { sid_alumno: sidAlumno, eliminado: { [Op.ne]: "si" } }),
    countUnread(Evaluacion, { sid_alumno: sidAlumno }),
    countUnread(AsignarEvento, { sid_alumno: sidAlumno }),
    countUnread(Asistencia, { sid_alumno: sidAlumno }),
  ]);

  return {
    Mensajes: mensajes > 0,
    Tareas: tareas > 0,
    Seguimientos: seguimientos > 0,
    Calificaciones: calificaciones > 0,
    Calendario: calendario > 0,
    Asistencias: asistencias > 0,
    Perfil: false,
    Configuracion: false,
  };
};

export const getContextoTemporal = async (_req, res) => {
  try {
    const contexto = await getTemporalContext();
    return ok(res, contexto);
  } catch (error) {
    console.error("[mobile getContextoTemporal]", error);
    return res.status(500).json({ error: "Error al obtener contexto temporal" });
  }
};

export const getAlumnos = async (req, res) => {
  try {
    const idPadre = getPadreId(req);
    if (!idPadre) return ok(res, []);

    const alumnoIds = await getAlumnoIdsByPadre(idPadre);
    if (!alumnoIds.length) return ok(res, []);

    const alumnos = await Alumno.findAll({
      where: { id_alumno: alumnoIds },
      order: [["nombre", "ASC"], ["apellido", "ASC"]],
    });

    const data = await Promise.all(
      alumnos.map(async (row) => {
        const alumno = toPlain(row);
        const notifications = await getNotificationsByAlumno(alumno.id_alumno);

        return {
          id_alumno: alumno.id_alumno,
          sid_instituto: alumno.sid_instituto,
          nombre: alumno.nombre,
          apellido: alumno.apellido,
          matricula: alumno.matricula,
          foto: alumno.foto,
          mensajes_no_leidos: notifications.Mensajes ? 1 : 0,
          seguimiento_no_leidos: notifications.Seguimientos ? 1 : 0,
          tareas_no_leidas: notifications.Tareas ? 1 : 0,
          evaluacion_no_leidos: notifications.Calificaciones ? 1 : 0,
          asistencia_no_leidas: notifications.Asistencias ? 1 : 0,
        };
      })
    );

    return ok(res, data);
  } catch (error) {
    console.error("[mobile getAlumnos]", error);
    return res.status(500).json({ error: "Error al obtener alumnos" });
  }
};

export const selectAlumno = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    if (!sidAlumno) return res.status(404).json({ error: "Alumno no encontrado" });

    const alumno = await Alumno.findByPk(sidAlumno);
    if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });

    const idPadre = getPadreId(req);
    if (idPadre) {
      const alumnoIds = await getAlumnoIdsByPadre(idPadre);
      if (!alumnoIds.includes(sidAlumno)) {
        return res.status(403).json({ error: "Alumno no pertenece al padre" });
      }
    }

    return ok(res, {
      status: "success",
      sid_grupo: alumno.sid_grupo,
      id_padre: idPadre,
    });
  } catch (error) {
    console.error("[mobile selectAlumno]", error);
    return res.status(500).json({ error: "Error al seleccionar alumno" });
  }
};

export const getMensajes = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    if (!sidAlumno) return ok(res, { mensajes: [], archivosAdjuntos: [], links: [] });
    const { limit, offset } = getPagination(req, 50);

    const asignaciones = await AsignarMensaje.findAll({
      where: { sid_alumno: sidAlumno },
    });

    const mensajeIds = asignaciones.map((row) => row.sid_mensaje).filter(Boolean);
    if (!mensajeIds.length) return ok(res, { mensajes: [], archivosAdjuntos: [], links: [] });

    const [mensajesPageRows, tiposRows] = await Promise.all([
      Mensaje.findAll({
        where: { id_mensaje: mensajeIds, eliminado: { [Op.ne]: "si" } },
        order: [["fecha_envio", "DESC"], ["hora_envio", "DESC"]],
        limit: limit + 1,
        offset,
      }),
      TipoMensaje.findAll(),
    ]);

    const { items: mensajesRows, pagination } = pageResult(mensajesPageRows, limit, offset);
    const pageMensajeIds = mensajesRows.map((row) => row.id_mensaje).filter(Boolean);

    const [archivosRows, linksRows] = pageMensajeIds.length
      ? await Promise.all([
          ArchivoMensaje.findAll({ where: { sid_mensaje: pageMensajeIds } }),
          UrlMensaje.findAll({ where: { sid_mensaje: pageMensajeIds } }),
        ])
      : [[], []];

    const tipoById = new Map(tiposRows.map((row) => [row.id_tipo_mensaje, row.nombre]));
    const asignacionByMensaje = new Map(
      asignaciones.map((row) => [row.sid_mensaje, toPlain(row)])
    );

    const mensajes = mensajesRows.map((row) => {
      const mensaje = toPlain(row);
      const asignacion = asignacionByMensaje.get(mensaje.id_mensaje) || {};

      return {
        ...mensaje,
        tipo_mensaje: tipoById.get(mensaje.sid_tipo) || "",
        leido: asignacion.leido ?? mensaje.leido,
        respuesta_rapida: asignacion.respuesta_rapida || "",
        permite_respuesta_rapida: normalizeSiNo(mensaje.respuesta_rapida),
        mensaje_programado: normalizeSiNo(mensaje.mensaje_programado),
        repetir: normalizeSiNo(mensaje.repetir),
        fecha_envio: isActiveValue(mensaje.mensaje_programado)
          ? mensaje.fecha_envio
          : "",
        hora_envio: isActiveValue(mensaje.mensaje_programado)
          ? mensaje.hora_envio
          : "",
        periodo: isActiveValue(mensaje.repetir) ? mensaje.periodo : "",
        fecha_fin: isActiveValue(mensaje.repetir) ? mensaje.fecha_fin : "",
      };
    });

    return ok(res, {
      mensajes,
      archivosAdjuntos: archivosRows
        .map(toPlain)
        .filter((archivo) => archivo.url),
      links: linksRows.map(toPlain).filter((link) => link.url),
      pagination,
    });
  } catch (error) {
    console.error("[mobile getMensajes]", error);
    return res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

export const responderMensaje = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    const { id } = req.params;
    const respuestaRaw = String(req.body?.respuesta || "").trim().toLowerCase();
    const respuesta = respuestaRaw === "sí" ? "si" : respuestaRaw;

    if (!sidAlumno) {
      return res.status(400).json({ status: "error", msg: "Alumno requerido" });
    }

    if (!["si", "no"].includes(respuesta)) {
      return res.status(400).json({ status: "error", msg: "Respuesta invalida" });
    }

    const [updated] = await AsignarMensaje.update(
      { respuesta_rapida: respuesta },
      { where: { sid_alumno: sidAlumno, sid_mensaje: id } }
    );

    if (!updated) {
      return res.status(404).json({ status: "error", msg: "Mensaje no encontrado" });
    }

    return ok(res, { status: "success", respuesta });
  } catch (error) {
    console.error("[mobile responderMensaje]", error);
    return res.status(500).json({ error: "Error al responder mensaje" });
  }
};

export const subirRespuestaTarea = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    const { id } = req.params;

    if (!sidAlumno) {
      return res.status(400).json({ status: "error", msg: "Alumno requerido" });
    }

    if (!req.file) {
      return res.status(400).json({ status: "error", msg: "Archivo requerido" });
    }

    const asignacion = await AsignarTarea.findOne({
      where: { id_asignar_tarea: id, sid_alumno: sidAlumno },
    });

    if (!asignacion) {
      return res.status(404).json({ status: "error", msg: "Tarea no encontrada" });
    }

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      useUniqueFileName: true,
    });

    const archivo = await ArchivoRespuestaTarea.create({
      id_archivo_respuesta_tarea: generadorID(10),
      archivo: uploadResponse.url,
      sid_asignar_tarea: id,
    });

    await asignacion.update({
      estatus: "enviado",
      leido: asignacion.leido || "si",
    });

    return ok(res, {
      status: "success",
      tarea: {
        id_asignar_tarea: id,
        estatus_tarea: "enviado",
        archivo: uploadResponse.url,
      },
      archivo: toPlain(archivo),
    });
  } catch (error) {
    console.error("[mobile subirRespuestaTarea]", error);
    return res.status(500).json({ error: "Error al subir respuesta de tarea" });
  }
};

export const getTareas = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    if (!sidAlumno) return ok(res, { tareas: [] });
    const { limit, offset } = getPagination(req, 20);

    const asignaciones = await AsignarTarea.findAll({ where: { sid_alumno: sidAlumno } });
    const tareaIds = asignaciones.map((row) => row.sid_tarea).filter(Boolean);
    if (!tareaIds.length) return ok(res, { tareas: [] });

    const tareasPageRows = await Tareas.findAll({
      where: { id_tareas: tareaIds },
      order: [["fecha_creacion", "DESC"]],
      limit: limit + 1,
      offset,
    });

    const { items: tareasRows, pagination } = pageResult(tareasPageRows, limit, offset);
    const pageTareaIds = tareasRows.map((row) => row.id_tareas).filter(Boolean);

    const pageAsignacionIds = asignaciones
      .filter((row) => pageTareaIds.includes(row.sid_tarea))
      .map((row) => row.id_asignar_tarea)
      .filter(Boolean);

    const [archivosRows, urlsRows, archivosRespuestaRows] = pageTareaIds.length
      ? await Promise.all([
          ArchivoTarea.findAll({ where: { sid_tarea: pageTareaIds } }),
          UrlTarea.findAll({ where: { sid_tarea: pageTareaIds } }),
          pageAsignacionIds.length
            ? ArchivoRespuestaTarea.findAll({
                where: { sid_asignar_tarea: pageAsignacionIds },
                order: [["id_archivo_respuesta_tarea", "DESC"]],
              })
            : [],
        ])
      : [[], [], []];

    const asignacionByTarea = new Map(asignaciones.map((row) => [row.sid_tarea, toPlain(row)]));
    const archivosByTarea = new Map();
    const urlsByTarea = new Map();
    const archivoRespuestaByAsignacion = new Map();

    archivosRows.forEach((row) => {
      const archivo = toPlain(row);
      archivosByTarea.set(archivo.sid_tarea, [
        ...(archivosByTarea.get(archivo.sid_tarea) || []),
        archivo.url,
      ]);
    });

    urlsRows.forEach((row) => {
      const url = toPlain(row);
      urlsByTarea.set(url.sid_tarea, [
        ...(urlsByTarea.get(url.sid_tarea) || []),
        url.url,
      ]);
    });

    archivosRespuestaRows.forEach((row) => {
      const archivo = toPlain(row);
      if (!archivoRespuestaByAsignacion.has(archivo.sid_asignar_tarea)) {
        archivoRespuestaByAsignacion.set(archivo.sid_asignar_tarea, archivo.archivo);
      }
    });

    const tareas = tareasRows.map((row) => {
      const tarea = toPlain(row);
      const asignacion = asignacionByTarea.get(tarea.id_tareas) || {};

      return {
        id_tareas: tarea.id_tareas,
        sid_grupo: tarea.sid_grupo,
        sid_materia: tarea.sid_materia,
        sid_instituto: tarea.sid_instituto,
        id_asignar_tarea: asignacion.id_asignar_tarea,
        nombre_tarea: tarea.nombre_tarea || tarea.materia || "Tarea",
        instrucciones_tarea: tarea.instrucciones_tarea,
        fecha_creacion: tarea.fecha_creacion,
        estatus_tarea: asignacion.estatus || "pendiente",
        observacion_tarea: asignacion.observacion || "",
        archivos_tarea: archivosByTarea.get(tarea.id_tareas) || [],
        archivo_respuesta: archivoRespuestaByAsignacion.get(asignacion.id_asignar_tarea) || "",
        url_tarea: urlsByTarea.get(tarea.id_tareas) || [],
      };
    });

    return ok(res, { tareas, pagination });
  } catch (error) {
    console.error("[mobile getTareas]", error);
    return res.status(500).json({ error: "Error al obtener tareas" });
  }
};

export const getSeguimientos = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    if (!sidAlumno) return ok(res, { seguimientos: [], atributos: [] });

    const seguimientosRows = await Seguimiento.findAll({
      where: { sid_alumno: sidAlumno, eliminado: { [Op.ne]: "si" } },
      order: [["fecha_registro", "DESC"]],
    });

    const seguimientoIds = seguimientosRows.map((row) => row.id_seguimiento);
    const atributosRows = seguimientoIds.length
      ? await AsignarAtributo.findAll({
          where: { sid_seguimiento: seguimientoIds },
          include: [{ model: Atributo, required: false }],
        })
      : [];

    const seguimientos = seguimientosRows.map((row) => {
      const seguimiento = toPlain(row);
      return {
        id_seguimiento: seguimiento.id_seguimiento,
        fecha_registro: seguimiento.fecha_registro,
        fecha: seguimiento.fecha_registro,
        observacion: seguimiento.observacion || "",
      };
    });

    const atributos = atributosRows.map((row) => {
      const asignacion = toPlain(row);
      return {
        id_atributo: asignacion.sid_atributo,
        sid_seguimiento: asignacion.sid_seguimiento,
        nombre: asignacion.Atributo?.nombre || "",
        icono: asignacion.Atributo?.icono || "",
        valor_atributo: asignacion.valor_atributo || "",
      };
    });

    return ok(res, { seguimientos, atributos });
  } catch (error) {
    console.error("[mobile getSeguimientos]", error);
    return res.status(500).json({ error: "Error al obtener seguimientos" });
  }
};

export const getCalificaciones = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    if (!sidAlumno) return ok(res, { calificaciones: [] });

    const rows = await VistaCalificaciones.findAll({
      where: { sid_alumno: sidAlumno },
      order: [["fecha_registro", "DESC"]],
    });

    const calificaciones = rows.map((row) => {
      const calificacion = toPlain(row);
      return {
        id_evaluacion: calificacion.id_evaluacion,
        foto: calificacion.foto,
        ciclo: calificacion.ciclo,
        nombre_nivel: calificacion.nombre_nivel,
        nombre_grado: calificacion.nombre_grado,
        nombre_grupo: calificacion.nombre_grupo,
      };
    });

    return ok(res, { calificaciones });
  } catch (error) {
    console.error("[mobile getCalificaciones]", error);
    return res.status(500).json({ error: "Error al obtener calificaciones" });
  }
};

export const getBoletaUrl = async (req, res) => {
  const { id } = req.params;
  return ok(res, {
    url: `https://aplicacionescolar.com/sistema/php/pdf/reporte_boleta_${id}.pdf`,
  });
};

export const getEventos = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    if (!sidAlumno) return ok(res, { eventos: [] });
    const { limit, offset } = getPagination(req, 10);

    const alumno = await Alumno.findByPk(sidAlumno);
    if (!alumno) return ok(res, { eventos: [] });

    const where = {
      sid_instituto: alumno.sid_instituto,
      [Op.or]: [
        { todos: true },
        { grupo: alumno.sid_grupo },
        { grado: alumno.sid_grado },
        { nivel: alumno.sid_nivel },
      ],
    };

    if (req.query.month && req.query.year) {
      const year = Number(req.query.year);
      const monthNumber = Number(req.query.month);
      const month = String(monthNumber).padStart(2, "0");
      const lastDay = new Date(year, monthNumber, 0).getDate();
      where.fecha = {
        [Op.between]: [`${year}-${month}-01`, `${year}-${month}-${lastDay}`],
      };
    }

    const pageRows = await Evento.findAll({
      where,
      order: [["fecha", "DESC"], ["hora", "DESC"]],
      limit: limit + 1,
      offset,
    });
    const { items: rows, pagination } = pageResult(pageRows, limit, offset);
    const eventos = rows.map((row) => {
      const evento = toPlain(row);
      return {
        id_evento: evento.id_evento,
        nombre_evento: evento.nombre,
        fecha_evento: evento.fecha,
        hora: evento.hora,
      };
    });

    return ok(res, { eventos, pagination });
  } catch (error) {
    console.error("[mobile getEventos]", error);
    return res.status(500).json({ error: "Error al obtener eventos" });
  }
};

export const getAsistencias = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    if (!sidAlumno) return ok(res, { asistencias: [] });
    const { limit, offset } = getPagination(req, 20);
    const today = formatDateOnly(new Date());

    const [hoyRows, historyPageRows] = await Promise.all([
      VistaAsistencia.findAll({
        where: { sid_alumno: sidAlumno, fecha_ingreso: today },
        order: [["hora", "DESC"]],
      }),
      VistaAsistencia.findAll({
        where: {
          sid_alumno: sidAlumno,
          fecha_ingreso: { [Op.ne]: today },
        },
        order: [["fecha_ingreso", "DESC"], ["hora", "DESC"]],
        limit: limit + 1,
        offset,
      }),
    ]);

    const { items: historyRows, pagination } = pageResult(historyPageRows, limit, offset);

    const formatAsistencia = (row) => {
      const asistencia = toPlain(row);
      return {
        id_asistencia: asistencia.id_asistencia,
        foto: asistencia.foto || 0,
        nombre: asistencia.nombre_alumno,
        apellido: asistencia.apellido_alumno,
        matricula: asistencia.matricula,
        fecha_ingreso: asistencia.fecha_ingreso,
        hora: asistencia.hora,
        tipo: asistencia.tipo,
      };
    };

    const asistenciasHoy = hoyRows.map(formatAsistencia);
    const asistencias = historyRows.map(formatAsistencia);

    return ok(res, { asistenciasHoy, asistencias, pagination });
  } catch (error) {
    console.error("[mobile getAsistencias]", error);
    return res.status(500).json({ error: "Error al obtener asistencias" });
  }
};

export const getPerfil = async (req, res) => {
  try {
    const idPadre = getPadreId(req);
    const { instituto, padre } = await getContextByPadre(idPadre);

    return ok(res, {
      perfil: {
        padre: {
          nombre: padre?.nombre || "",
          apellido: padre?.apellido || "",
          correo: padre?.correo || "",
        },
        instituto: {
          nombre: instituto?.nombre || "",
          correo: instituto?.correo || "",
          logo: instituto?.logo || "",
          descripcion: instituto?.descripcion || "",
        },
      },
    });
  } catch (error) {
    console.error("[mobile getPerfil]", error);
    return res.status(500).json({ error: "Error al obtener perfil" });
  }
};

export const getNotificaciones = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    const notifications = await getNotificationsByAlumno(sidAlumno);
    return ok(res, notifications);
  } catch (error) {
    console.error("[mobile getNotificaciones]", error);
    return res.status(500).json({ error: "Error al obtener notificaciones" });
  }
};

export const registrarDispositivo = async (req, res) => {
  try {
    const idPadre = getPadreId(req);
    const tokenDispositivo =
      typeof req.body?.token_dispositivo === "string"
        ? req.body.token_dispositivo.trim()
        : "";
    const badgeNotificaciones = Number(req.body?.badge_notificaciones ?? 0);

    if (!idPadre) {
      return res.status(400).json({ status: "error", msg: "id_padre requerido" });
    }

    if (!tokenDispositivo) {
      return res.status(400).json({ status: "error", msg: "token_dispositivo requerido" });
    }

    const padre = await Padre.findByPk(idPadre);
    if (!padre) {
      return res.status(404).json({ status: "error", msg: "Padre no encontrado" });
    }

    const existingDevice = await DispositivosPadre.findOne({
      where: { token_dispositivo: tokenDispositivo },
    });

    if (existingDevice) {
      await existingDevice.update({
        id_padre: idPadre,
        badge_notificaciones: Number.isFinite(badgeNotificaciones)
          ? badgeNotificaciones
          : 0,
      });

      return ok(res, {
        status: "ok",
        dispositivo: toPlain(existingDevice),
      });
    }

    const dispositivo = await DispositivosPadre.create({
      id_dispositivos_padre: generadorID(10),
      id_padre: idPadre,
      token_dispositivo: tokenDispositivo,
      badge_notificaciones: Number.isFinite(badgeNotificaciones)
        ? badgeNotificaciones
        : 0,
    });

    return ok(res, {
      status: "ok",
      dispositivo: toPlain(dispositivo),
    });
  } catch (error) {
    console.error("[mobile registrarDispositivo]", error);
    return res.status(500).json({ status: "error", msg: "Error al registrar dispositivo" });
  }
};

export const marcarVistos = async (req, res) => {
  try {
    const sidAlumno = await getSelectedAlumnoId(req);
    const { modulo } = req.params;

    if (!sidAlumno) return ok(res, { status: "success" });

    const update = { leido: "si" };

    if (modulo === "mensajes") await AsignarMensaje.update(update, { where: { sid_alumno: sidAlumno } });
    if (modulo === "tareas") await AsignarTarea.update(update, { where: { sid_alumno: sidAlumno } });
    if (modulo === "seguimientos") await Seguimiento.update(update, { where: { sid_alumno: sidAlumno } });
    if (modulo === "calificaciones") await Evaluacion.update(update, { where: { sid_alumno: sidAlumno } });
    if (modulo === "calendario") await AsignarEvento.update(update, { where: { sid_alumno: sidAlumno } });
    if (modulo === "asistencias") await Asistencia.update(update, { where: { sid_alumno: sidAlumno } });

    return ok(res, { status: "success" });
  } catch (error) {
    console.error("[mobile marcarVistos]", error);
    return res.status(500).json({ error: "Error al marcar vistos" });
  }
};
