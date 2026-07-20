import express from "express";
import { getAll, getAllExcel } from "../controllers/vistaMensajesController.js";

const router = express.Router();

router.get("/excel/:sid_instituto", getAllExcel);
router.get("/", getAll);

export const basePath = "/api/vista-mensajes";
export default router;
