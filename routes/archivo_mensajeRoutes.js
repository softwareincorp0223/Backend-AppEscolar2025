import express from "express";
import { getAll, getById, createOne, updateOne, deleteOne } from "../controllers/archivo_mensajeController.js";
import generarIdMiddleware from "../middleware/generarIdMiddleware.js";

const router = express.Router();
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", generarIdMiddleware, createOne);
router.put("/:id", updateOne);
router.delete("/", deleteOne);
router.delete("/:id", deleteOne);
export const basePath = "/api/archivo_mensaje";
export default router;