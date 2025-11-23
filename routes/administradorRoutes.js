/*
//FUNCIONALIDAD ANTES 
import express from "express";
import { getAll, getById, createOne, updateOne, deleteOne } from "../controllers/administradorController.js";
const router = express.Router();
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);
export const basePath = "/api/administrador";
export default router;*/

// routes/administradorRoutes.js
import express from "express";
import {
  getAll,
  getById,
  createOne,
  updateOne,
  deleteOne,
} from "../controllers/administradorController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, getAll);
router.get("/:id", verificarToken, getById);
router.post("/", verificarToken, createOne);
router.put("/:id", verificarToken, updateOne);
router.delete("/:id", verificarToken, deleteOne);

export const basePath = "/api/administrador";
export default router;
