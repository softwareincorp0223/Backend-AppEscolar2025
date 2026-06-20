import express from "express";
import { getAll, getById, createOne, updateOne, deleteOne } from "../controllers/mensajeController.js";
import multer from "multer";
import upload from "../middleware/upload.js";
import generarIdMiddleware from "../middleware/generarIdMiddleware.js";

const router = express.Router();
router.get("/", getAll);
router.get("/:id", getById);
router.post(
    "/",
    upload.array("archivos"),
    generarIdMiddleware,
    createOne,
);

router.put(
    "/:id",
    upload.array("archivos"),
    updateOne,
);
router.delete("/:id", deleteOne);

export const basePath = "/api/mensaje";

export default router;