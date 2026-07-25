import express from "express";
import createCRUD from "../controllers/core/genericController.js";
import VistaGradoGrupo from "../models/vista_grado_grupo.js";

const router = express.Router();
const controller = createCRUD(VistaGradoGrupo, "id_grupo");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

export const basePath = "/api/vistagradogrupo";
export default router;
