// routes/estadisticas.js
import express from "express";
import {
  getAll,
  getById,
  createOne,
  updateOne,
  deleteOne,
} from "../controllers/estadisticasController.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createOne);
router.put("/", updateOne);
router.put("/:id", updateOne);
router.delete("/", deleteOne);
router.delete("/:id", deleteOne);

export const basePath = "/api/estadisticas";
export default router;