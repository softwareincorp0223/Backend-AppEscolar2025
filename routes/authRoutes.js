// routes/authRoutes.js
import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

export const basePath = "/api/auth";
export default router;
