import express from "express";
import generarIdMiddleware from "../middleware/generarIdMiddleware.js";
import { getAll, getById, createOne, updateOne, deleteOne } from "../controllers/seguimientoController.js";
const router = express.Router();
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", generarIdMiddleware, createOne);
router.put("/", updateOne);
router.put("/:id", updateOne);
router.delete("/", deleteOne);
router.delete("/:id", deleteOne);
export const basePath = "/api/seguimiento";
export default router;

