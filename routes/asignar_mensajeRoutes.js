import express from "express";
import {getById, createOne, updateOne, deleteOne } from "../controllers/asignar_mensajeController.js";
import generarIdMiddleware from "../middleware/generarIdMiddleware.js";

const router = express.Router();
router.get("/:id", getById);
router.post("/", generarIdMiddleware, createOne);
router.put("/:id", updateOne);
router.delete("/", deleteOne);
router.delete("/:id", deleteOne);
export const basePath = "/api/asignar_mensaje";
export default router;