// routes/authRoutes.js
import express from "express";
import { login, getMyPermissions } from "../controllers/authController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me/permissions", verificarToken, getMyPermissions);

export const basePath = "/api/auth";
export default router;
