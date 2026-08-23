import express from "express";
import multer from "multer";

import {
  getAlumnos,
  getAsistencias,
  getBoletaUrl,
  getCalificaciones,
  getContextoTemporal,
  getEventos,
  getMensajes,
  getNotificaciones,
  getPerfil,
  getSeguimientos,
  getTareas,
  marcarVistos,
  registrarDispositivo,
  responderMensaje,
  selectAlumno,
  subirRespuestaTarea,
} from "../controllers/mobileController.js";
import { registrarAsistenciaQR } from "../controllers/mobileAttendanceController.js";
import { descargarBoletaCalificacionesMobile } from "../controllers/mobileGradePdfController.js";
import upload from "../middleware/upload.js";
import {
  enviarPushCalificacionesImport,
  enviarPushEvento,
  enviarPushMensajeInmediato,
  enviarPushSeguimiento,
  enviarPushSeguimientosImport,
  enviarPushTarea,
} from "../controllers/mobilePushController.js";

const router = express.Router();

const uploadTareaRespuesta = (req, res, next) => {
  upload.single("archivo")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "error",
        msg: "El archivo debe pesar 10 MB o menos.",
      });
    }

    return res.status(400).json({
      status: "error",
      msg: error.message || "Error al procesar el archivo.",
    });
  });
};

router.get("/contexto-temporal", getContextoTemporal);
router.get("/alumnos", getAlumnos);
router.post("/alumnos/select", selectAlumno);

router.get("/mensajes", getMensajes);
router.post("/mensajes/:id/respuesta", responderMensaje);

router.get("/tareas", getTareas);
router.post("/tareas/:id/respuesta", uploadTareaRespuesta, subirRespuestaTarea);
router.get("/seguimientos", getSeguimientos);
router.get("/calificaciones", getCalificaciones);
router.get("/calificaciones/alumno/:idAlumno/boleta", descargarBoletaCalificacionesMobile);
router.get("/calificaciones/:id/boleta", getBoletaUrl);
router.get("/calendario", getEventos);
router.get("/asistencias", getAsistencias);
router.post("/asistencias/registrar-qr", registrarAsistenciaQR);
router.get("/perfil", getPerfil);
router.get("/notificaciones", getNotificaciones);
router.post("/dispositivos/register", registrarDispositivo);
router.post("/notificaciones/mensajes/:id/enviar", enviarPushMensajeInmediato);
router.post("/notificaciones/tareas/:id/enviar", enviarPushTarea);
router.post("/notificaciones/seguimientos/import/enviar", enviarPushSeguimientosImport);
router.post("/notificaciones/seguimientos/:id/enviar", enviarPushSeguimiento);
router.post("/notificaciones/calificaciones/import/enviar", enviarPushCalificacionesImport);
router.post("/notificaciones/calendario/:id/enviar", enviarPushEvento);

router.post("/:modulo/marcar-vistos", marcarVistos);

export const basePath = "/api/mobile";
export default router;


