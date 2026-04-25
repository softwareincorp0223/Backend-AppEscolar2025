import express from "express";
import { getAll } from "../controllers/vistaHistorialMensajesController.js";

const router = express.Router();

router.get("/", getAll);

export const basePath = "/api/vista-historial-mensajes";
export default router;