// middlewares/generarIdMiddleware.js
import { generadorID } from "../helpers/generadorID.js";

export default function generarIdMiddleware(req, res, next) {
  if (!req.body || typeof req.body !== "object") return next();

  const idKey = Object.keys(req.body).find((k) => k.startsWith("id_"));
  if (idKey && (!req.body[idKey] || String(req.body[idKey]).trim() === "")) {
    req.body[idKey] = generadorID(10);
  }

  return next();
}
