/*
//FUNCIONALIDAD ANTES 
import Administrador from "../models/administrador.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/administradorSchema.js";

const crud = createCRUD(Administrador, "id_admin");

export const getAll = crud.getAll;

export const getById = crud.getById;

export const createOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;
  return crud.createOne(req, res);
};

export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;
  return crud.updateOne(req, res);
};

export const deleteOne = crud.deleteOne;
*/

// controllers/administradorController.js
import Administrador from "../models/administrador.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/administradorSchema.js";
import bcrypt from "bcrypt";

const crud = createCRUD(Administrador, "id_admin");

export const getAll = crud.getAll;
export const getById = crud.getById;

export const createOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  value.contrasena = await bcrypt.hash(value.contrasena, 10);
  req.body = value;
  return crud.createOne(req, res);
};

export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  if (value.contrasena)
    value.contrasena = await bcrypt.hash(value.contrasena, 10);

  req.body = value;
  return crud.updateOne(req, res);
};

export const deleteOne = crud.deleteOne;
