import Asistencia from "../models/asistencia.js";
import Alumno from "../models/alumno.js";
import { generadorID } from "../helpers/generadorID.js";
import { sendPushToAlumnos } from "../services/pushNotificationService.js";

const today = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
};

const currentTime = () => {
  return new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    timeZone: "America/Mexico_City",
  });
};

export const registrarAsistenciaQR = async (req, res) => {
  try {
    const { alumno: alumnoQR, sid_usuario, sid_instituto, tipo = "entrada" } = req.body || {};

    if (!alumnoQR?.id_alumno || !sid_usuario) {
      return res.status(400).json({
        status: "error",
        msg: "alumno y sid_usuario son requeridos",
      });
    }

    const alumno = await Alumno.findByPk(alumnoQR.id_alumno);

    if (!alumno) {
      return res.status(404).json({
        status: "error",
        msg: "Alumno no encontrado",
      });
    }

    if (
      sid_instituto &&
      alumno.sid_instituto &&
      String(alumno.sid_instituto) !== String(sid_instituto)
    ) {
      return res.status(403).json({
        status: "error",
        msg: "El alumno no pertenece a este instituto",
      });
    }

    const alumnoPlain = alumno.toJSON ? alumno.toJSON() : alumno;

    const asistencia = await Asistencia.create({
      id_asistencia: generadorID(20),
      sid_alumno: alumnoPlain.id_alumno,
      fecha_ingreso: today(),
      hora: currentTime(),
      tipo,
      leido: "no",
      sid_usuario,
    });

    const nombreAlumno = [alumnoPlain.nombre, alumnoPlain.apellido]
      .filter(Boolean)
      .join(" ");

    const pushResult = await sendPushToAlumnos({
      sidAlumnos: [alumnoPlain.id_alumno],
      title: "Asistencia registrada",
      body: nombreAlumno
        ? `${nombreAlumno} registro asistencia.`
        : "Se registro una asistencia.",
      tipoModulo: "asistencias",
      sidReferencia: asistencia.id_asistencia,
      data: {
        modulo: "asistencias",
        tipo_modulo: "asistencias",
        sid_referencia: asistencia.id_asistencia,
        id_asistencia: asistencia.id_asistencia,
        sid_alumno: alumnoPlain.id_alumno,
      },
    });

    return res.json({
      status: "ok",
      msg: "Asistencia registrada correctamente",
      id_asistencia: asistencia.id_asistencia,
      alumno: {
        id_alumno: alumnoPlain.id_alumno,
        nombre: alumnoPlain.nombre,
        apellido: alumnoPlain.apellido,
        matricula: alumnoPlain.matricula,
        sid_instituto: alumnoPlain.sid_instituto,
      },
      notificacion: {
        sent: pushResult.sent,
        dispositivos: pushResult.dispositivos,
        tokens: pushResult.tokens,
        errors: pushResult.errors,
      },
    });
  } catch (error) {
    console.error("[mobile registrarAsistenciaQR]", error);

    return res.status(500).json({
      status: "error",
      msg: error.message || "No fue posible registrar la asistencia",
    });
  }
};
