import express from "express";
import { getAll } from "../controllers/vistaTareasController.js";

const router = express.Router();

router.get("/", getAll);

export const basePath = "/api/vistatareas";
export default router;