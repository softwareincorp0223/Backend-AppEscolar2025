import express from "express";
import createCRUD from "../controllers/core/genericController.js";
import VistaAsistencia from "../models/vistaAsistencia.js";

const router = express.Router();

const controller = createCRUD(VistaAsistencia);

router.get("/excel/:sid_instituto", async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const data = await VistaAsistencia.findAll({
      where: { sid_instituto },
      order: [["fecha_ingreso", "DESC"]],
    });

    return res.json(data);
  } catch (error) {
    console.error("[getAllExcel]", error);
    return res.status(500).json({ error: "Error al obtener asistencias" });
  }
});

router.get("/", controller.getAll);

export default router;
