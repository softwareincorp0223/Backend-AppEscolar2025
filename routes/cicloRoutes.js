import express from "express";
import generarIdMiddleware from "../middleware/generarIdMiddleware.js";
import {
  getAll,
  getById,
  createOne,
  updateOne,
  deleteOne,
  getEstado,
  regularizarEscuela,
  validarPasoCiclo,
  pasarCiclo,
} from "../controllers/cicloController.js";
const router = express.Router();
router.get("/", getAll);
router.get("/estado/:sid_instituto", getEstado);
router.post("/regularizar", regularizarEscuela);
router.post("/validar-paso", validarPasoCiclo);
router.post("/pasar", pasarCiclo);
router.get("/:id", getById);
router.post("/", generarIdMiddleware, createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);
export const basePath = "/api/ciclo";
export default router;
