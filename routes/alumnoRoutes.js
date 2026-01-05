import express from "express";
import { getAll, getById, createOne, updateOne, deleteOne, alumnosPadres } from "../controllers/alumnoController.js";
import generarIdMiddleware from "../middleware/generarIdMiddleware.js";

const router = express.Router();
router.get("/", getAll);
router.get("/alumnos/:sid_instituto", alumnosPadres);
router.get("/:id", getById);
router.post("/", generarIdMiddleware, createOne);
router.put("/:id", updateOne);
router.delete("/", deleteOne);
router.delete("/:id", deleteOne);
export const basePath = "/api/alumno";
export default router;