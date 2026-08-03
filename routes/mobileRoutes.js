import express from "express";

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
  responderMensaje,
  selectAlumno,
} from "../controllers/mobileController.js";

const router = express.Router();

router.get("/contexto-temporal", getContextoTemporal);
router.get("/alumnos", getAlumnos);
router.post("/alumnos/select", selectAlumno);

router.get("/mensajes", getMensajes);
router.post("/mensajes/:id/respuesta", responderMensaje);

router.get("/tareas", getTareas);
router.get("/seguimientos", getSeguimientos);
router.get("/calificaciones", getCalificaciones);
router.get("/calificaciones/:id/boleta", getBoletaUrl);
router.get("/calendario", getEventos);
router.get("/asistencias", getAsistencias);
router.get("/perfil", getPerfil);
router.get("/notificaciones", getNotificaciones);

router.post("/:modulo/marcar-vistos", marcarVistos);

export const basePath = "/api/mobile";
export default router;
