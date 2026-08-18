import express from "express";
import { getAll, getById, createOne, updateOne, deleteOne } from "../controllers/mensajeController.js";
import multer from "multer";
import upload from "../middleware/upload.js";
import generarIdMiddleware from "../middleware/generarIdMiddleware.js";

const router = express.Router();

const uploadArchivos = (req, res, next) => {
    upload.array("archivos")(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                ok: false,
                message: "Cada archivo adjunto debe pesar 5 MB o menos.",
            });
        }

        return res.status(400).json({
            ok: false,
            message: error.message || "Error al procesar archivos adjuntos.",
        });
    });
};

router.get("/", getAll);
router.get("/:id", getById);
router.post(
    "/",
    uploadArchivos,
    generarIdMiddleware,
    createOne,
);

router.put(
    "/:id",
    uploadArchivos,
    updateOne,
);
router.delete("/", deleteOne);
router.delete("/:id", deleteOne);

export const basePath = "/api/mensaje";

export default router;
