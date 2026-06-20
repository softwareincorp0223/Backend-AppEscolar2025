import express from "express";
import { getAll } from "../controllers/vistaAsignarMensajeAlumnoController.js";

const router = express.Router();

router.get("/", getAll);

export const basePath = "/api/vista_asignar_mensaje_alumno";
export default router;