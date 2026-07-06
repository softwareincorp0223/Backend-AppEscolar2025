import express from "express";

import upload from "../middleware/upload.js";

import { upload as uploadDrive } from "../controllers/driveController.js";

const router = express.Router();

//=========================
// Subir archivos
//=========================

router.post(

  "/upload",

  upload.array("files"),

  uploadDrive

);

export const basePath = "/api/drive";

export default router;