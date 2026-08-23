import Asistencia from "../models/asistencia.js";
import Alumno from "../models/alumno.js";
import { generadorID } from "../helpers/generadorID.js";
import { sendPushToAlumnos } from "../services/pushNotificationService.js";

const ATTENDANCE_TYPES = {
  ENTRADA: "entrada",
  SALIDA: "salida",
};

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

const normalizeAttendanceType = (tipo) =>
  String(tipo || "")
    .trim()
    .toLowerCase();

const resolveNextAttendanceType = (asistenciasHoy) => {
  const tiposRegistrados = asistenciasHoy.map((asistencia) =>
    normalizeAttendanceType(asistencia.tipo)
  );

  const tieneEntrada = tiposRegistrados.includes(ATTENDANCE_TYPES.ENTRADA);
  const tieneSalida = tiposRegistrados.includes(ATTENDANCE_TYPES.SALIDA);

  if (tieneSalida) {
    return {
      allowed: false,
      msg: "El alumno ya registro entrada y salida hoy",
    };
  }

  if (tieneEntrada) {
    return {
      allowed: true,
      tipo: ATTENDANCE_TYPES.SALIDA,
    };
  }

  return {
    allowed: true,
    tipo: ATTENDANCE_TYPES.ENTRADA,
  };
};

export const registrarAsistenciaQR = async (req, res) => {
  try {
    const { alumno: alumnoQR, sid_usuario, sid_instituto } = req.body || {};

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
    const fechaIngreso = today();
    const asistenciasHoy = await Asistencia.findAll({
      where: {
        sid_alumno: alumnoPlain.id_alumno,
        fecha_ingreso: fechaIngreso,
      },
      order: [["hora", "ASC"]],
    });

    const siguienteAsistencia = resolveNextAttendanceType(asistenciasHoy);

    if (!siguienteAsistencia.allowed) {
      return res.status(409).json({
        status: "error",
        msg: siguienteAsistencia.msg,
      });
    }

    const asistencia = await Asistencia.create({
      id_asistencia: generadorID(20),
      sid_alumno: alumnoPlain.id_alumno,
      fecha_ingreso: fechaIngreso,
      hora: currentTime(),
      tipo: siguienteAsistencia.tipo,
      leido: "no",
      sid_usuario,
    });

    const nombreAlumno = [alumnoPlain.nombre, alumnoPlain.apellido]
      .filter(Boolean)
      .join(" ");
    const tipoLabel =
      siguienteAsistencia.tipo === ATTENDANCE_TYPES.SALIDA ? "salida" : "entrada";

    const pushResult = await sendPushToAlumnos({
      sidAlumnos: [alumnoPlain.id_alumno],
      title: "Asistencia registrada",
      body: nombreAlumno
        ? `${nombreAlumno} registro ${tipoLabel}.`
        : `Se registro una ${tipoLabel}.`,
      tipoModulo: "asistencias",
      sidReferencia: asistencia.id_asistencia,
      data: {
        modulo: "asistencias",
        tipo_modulo: "asistencias",
        sid_referencia: asistencia.id_asistencia,
        id_asistencia: asistencia.id_asistencia,
        sid_alumno: alumnoPlain.id_alumno,
        tipo: siguienteAsistencia.tipo,
      },
    });

    return res.json({
      status: "ok",
      msg: "Asistencia registrada correctamente",
      id_asistencia: asistencia.id_asistencia,
      tipo: siguienteAsistencia.tipo,
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
