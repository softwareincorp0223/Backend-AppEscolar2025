import express from "express";
import { getAll, getById, createOne, updateOne, deleteOne, getEvaluacion, getAllExcel, getCalificacionPdf } from "../controllers/evaluacionController.js";
const router = express.Router();
router.get("/", getAll);
router.get("/calificacion/:sid_instituto", getEvaluacion);
router.get("/excel/:sid_instituto", getAllExcel);
router.get("/pdf/:id_alumno", getCalificacionPdf);
router.get("/:id", getById);
router.post("/", createOne);
router.put("/:id", updateOne);
router.delete("/", deleteOne);
router.delete("/:id", deleteOne);

export const basePath = "/api/evaluacion";
export default router;