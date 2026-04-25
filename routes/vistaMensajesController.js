import express from "express";
import { getAll } from "../controllers/vistaMensajesController.js";

const router = express.Router();

router.get("/", getAll);

export const basePath = "/api/vista-mensajes";
export default router;