import express from "express";
import { getAll } from "../controllers/vistaRegistroMensajesController.js";

const router = express.Router();

router.get("/", getAll);

export const basePath = "/api/vista-registro-mensajes";
export default router;