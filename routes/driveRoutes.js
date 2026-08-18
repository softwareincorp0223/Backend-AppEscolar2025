import express from "express";
import multer from "multer";

import upload from "../middleware/upload.js";

import { upload as uploadDrive } from "../controllers/driveController.js";

const router = express.Router();

const uploadFiles = (req, res, next) => {
  upload.array("files")(req, res, (error) => {
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

//=========================
// Subir archivos
//=========================

router.post(

  "/upload",

  uploadFiles,

  uploadDrive

);

export const basePath = "/api/drive";

export default router;
