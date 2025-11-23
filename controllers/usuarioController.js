import Usuario from "../models/usuario.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/usuarioSchema.js";
import { hashPassword } from "../helpers/password.js"; // <- asegúrate de importar bien tu helper

const crud = createCRUD(Usuario, "id_usuario");

export const getAll = crud.getAll;
export const getById = crud.getById;
export const createOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;

  // Encriptar contraseña si existe en el body
  if (req.body.contrasena) {
    try {
      req.body.contrasena = await hashPassword(req.body.contrasena);
    } catch (err) {
      console.error("[hashPassword]", err);
      return res
        .status(500)
        .json({ error: "Error al encriptar la contraseña" });
    }
  }

  return crud.createOne(req, res);
};
export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;

  // Encriptar contraseña si existe en el body
  if (req.body.contrasena) {
    try {
      req.body.contrasena = await hashPassword(req.body.contrasena);
    } catch (err) {
      console.error("[hashPassword]", err);
      return res
        .status(500)
        .json({ error: "Error al encriptar la contraseña" });
    }
  }

  return crud.updateOne(req, res);
};
export const deleteOne = crud.deleteOne;