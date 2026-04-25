import express from "express";
import { getAll } from "../controllers/vistaAsignacionMateriasController.js";

const router = express.Router();

router.get("/", getAll);

export const basePath = "/api/vista-asignar-materias";
export default router;