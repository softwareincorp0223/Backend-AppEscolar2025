import express from "express";
import createCRUD from "../controllers/core/genericController.js";
import VistaAsistencia from "../models/vistaAsistencia.js";

const router = express.Router();

const controller = createCRUD(VistaAsistencia);

router.get("/", controller.getAll);

export default router;
