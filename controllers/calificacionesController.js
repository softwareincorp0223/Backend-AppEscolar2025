import Calificaciones from "../models/calificaciones.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/calificacionesSchema.js";

const crud = createCRUD(Calificaciones, "id_calificaciones");

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